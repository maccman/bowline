
if (typeof(Titanium)=='undefined') Titanium = {};

var TFS = Titanium.Filesystem;

Titanium.Project = 
{
	getVersions:function(dir)
	{
		var entry = {name:dir.name(), versions:[], dir:dir};
		var versions = dir.getDirectoryListing();
		for (var v=0;v<versions.length;v++)
		{
			entry.versions.push(versions[v].name());
		}
		return entry;
	},
	getModulesAndRuntime:function()
	{
		var dir = Titanium.Process.getEnv('KR_RUNTIME_HOME');
		var modules = TFS.getFile(dir,'modules');
		var dirs = modules.getDirectoryListing();
		var result = [];
		for (var c=0;c<dirs.length;c++)
		{
			result.push(this.getVersions(dirs[c]));
		}
		var runtime = TFS.getFile(dir,'runtime',Titanium.platform);
		return {
			modules: result,
			runtime: this.getVersions(runtime),
			runtime_basedir: runtime,
			modules_basedir: modules
		};
	},
	parseEntry:function(entry)
	{
		if (entry[0]==' ' || entry.length==0) return null;
		var i = entry.indexOf(':');
		if (i < 0) return null;
		var key = jQuery.trim(entry.substring(0,i));
		var value = jQuery.trim(entry.substring(i+1));
		var token = false;
		if (key.charAt(0)=='#')
		{
			token = true;
			key = key.substring(1);
		}
		return {
			key: key,
			value: value,
			token: token
		};
	},
	addEntry:function(line,result)
	{
		if (line)
		{
			var entry = Titanium.Project.parseEntry(line);
			if (!entry) return;
			if (entry.token) 
				result.properties[entry.key]=entry.value;
			else
				result.map[entry.key]=entry.value;
		}
	},
	getManifest:function(mf)
	{
		var manifest = TFS.getFile(mf);
		if (!manifest.isFile())
		{
			return {
				success:false,
				message:"Couldn't find manifest!"
			};
		}
		var result = {
			success:true,
			file:manifest,
			map:{},
			properties:{}
		};
		var line = manifest.readLine(true);
		Titanium.Project.addEntry(line,result);
		while (true)
		{
			line = manifest.readLine();
			if(!line) break;
			Titanium.Project.addEntry(line,result);
		}
		return result;
	},
	create:function(name,dir,publisher,url,image)
	{
		var outdir = TFS.getFile(dir,name);
		if (outdir.isDirectory())
		{
			return {
				success:false,
				message:"Directory already exists: " + outdir
			}
		}
		outdir.createDirectory(true);
		var normalized_name = name.replace(' ','_').toLowerCase();
		var normalized_publisher = publisher.replace(' ','_').toLowerCase();
		// write out the TIAPP.xml
		var tiappxml = this.XML_PROLOG;
		var year = new Date().getFullYear();
		var id = 'com.'+normalized_publisher+'.'+normalized_name;
		tiappxml+=this.makeEntry('id',id);
		tiappxml+=this.makeEntry('name',name);
		tiappxml+=this.makeEntry('version','1.0');
		tiappxml+=this.makeEntry('publisher',publisher);
		tiappxml+=this.makeEntry('url',url);
		tiappxml+=this.makeEntry('copyright',year+' by '+publisher);
		tiappxml+="<window>\n";
		tiappxml+=this.makeEntry('id','initial');
		tiappxml+=this.makeEntry('title',name);
		tiappxml+=this.makeEntry('url','app://index.html');
		tiappxml+=this.makeEntry('width','700');
		tiappxml+=this.makeEntry('max-width','3000');
		tiappxml+=this.makeEntry('min-width','0');
		tiappxml+=this.makeEntry('height','800');
		tiappxml+=this.makeEntry('max-height','3000');
		tiappxml+=this.makeEntry('min-height','0');
		tiappxml+=this.makeEntry('fullscreen','false');
		tiappxml+=this.makeEntry('resizable','true');
		tiappxml+=this.makeEntry('chrome','true',{'scrollbars':'true'});
		tiappxml+=this.makeEntry('maximizable','true');
		tiappxml+=this.makeEntry('minimizable','true');
		tiappxml+=this.makeEntry('closeable','true');
		tiappxml+="</window>\n";
		tiappxml+=this.XML_EPILOG;
		var ti = TFS.getFile(outdir,'tiapp.xml');
		ti.write(tiappxml);
		var resources = TFS.getFile(outdir,'resources');
		resources.createDirectory();
		var index = TFS.getFile(resources,'index.html');
		index.write('<html>\n<head>\n</head>\n<body>\nHello,world\n</body>\n</html>');
		
		var manifest = "#appname: "+name+"\n" +
		"#publisher: "+publisher+"\n"+
		"#url: "+url+"\n"+
		"#image: "+image+"\n"+
		"#appid: "+id+"\n";
		
		var mf = TFS.getFile(outdir,'manifest');
		mf.write(manifest);
		
		var gi = TFS.getFile(outdir,'.gitignore');
		gi.write('dist\ntmp\n');
		
		var dist = TFS.getFile(outdir,'dist');
		dist.createDirectory();
		
		return {
			basedir: outdir,
			resources: resources,
			id: id,
			name: name,
			success:true
		};
	},
	makeEntry:function(key,value,attrs)
	{
		var str = '<' + key;
		if (attrs)
		{
			str+=' ';
			var values = [];
			for (name in attrs)
			{
				var v = attrs[name];
				if (v)
				{
					values.push(name + '=' + '"' + v + '"');
				}
			}
			str+=values.join(' ');
		}
		str+='>' + value + '</'+key+'>\n';
		return str;
	}
};

Titanium.Project.XML_PROLOG = "<?xml version='1.0' encoding='UTF-8'?>\n" +
	"<ti:app xmlns:ti='http://ti.appcelerator.org'>\n";
	
Titanium.Project.XML_EPILOG = "</ti:app>";
	
