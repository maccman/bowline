#ifndef ScriptEvaluator_h
#define ScriptEvaluator_h

namespace WebCore {
	class ScriptSourceCode;

	class ScriptEvaluator {
	public:
		virtual ~ScriptEvaluator(){}
		virtual bool matchesMimeType(const String& mimeType) = 0;
		virtual void evaluate(const String& mimeType, const ScriptSourceCode& sourceCode, void *context) = 0;
	};
}

#endif
