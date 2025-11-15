import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  readOnly?: boolean;
  onChange?: (code: string) => void;
  height?: string;
  theme?: string;
}

export const InteractiveCodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = '',
  language = 'python',
  readOnly = false,
  onChange,
  height = '400px',
  theme = 'vs-dark'
}) => {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onChange?.(newCode);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    onChange?.(initialCode);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* 工具栏 */}
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">{language.toUpperCase()}</span>
          {readOnly && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              只读
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            {copied ? '已复制!' : '复制'}
          </button>
          {!readOnly && (
            <button
              onClick={resetCode}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              重置
            </button>
          )}
        </div>
      </div>

      {/* 编辑器 */}
      <Editor
        height={height}
        language={language}
        value={code}
        onChange={handleEditorChange}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on'
        }}
        theme={theme}
      />
    </div>
  );
};

interface CodeExerciseProps {
  title: string;
  description: string;
  initialCode: string;
  solution: string;
  hints?: string[];
  language?: string;
  validate?: (code: string) => { isValid: boolean; message?: string };
}

export const CodeExercise: React.FC<CodeExerciseProps> = ({
  title,
  description,
  initialCode,
  solution,
  hints = [],
  language = 'python',
  validate
}) => {
  const [userCode, setUserCode] = useState(initialCode);
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; message?: string } | null>(null);

  const runValidation = () => {
    if (validate) {
      const result = validate(userCode);
      setValidationResult(result);
    } else {
      // 默认验证：检查是否包含关键函数
      const hasFunction = userCode.includes('def ') || userCode.includes('function ');
      setValidationResult({
        isValid: hasFunction,
        message: hasFunction ? '代码格式正确！' : '请定义一个函数来完成任务。'
      });
    }
  };

  const resetExercise = () => {
    setUserCode(initialCode);
    setShowSolution(false);
    setShowHints(false);
    setValidationResult(null);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>

      <div className="p-6 space-y-4">
        {/* 代码编辑器 */}
        <InteractiveCodeEditor
          initialCode={userCode}
          language={language}
          onChange={setUserCode}
          height="300px"
        />

        {/* 操作按钮 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={runValidation}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              验证代码
            </button>
            <button
              onClick={() => setShowHints(!showHints)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              {showHints ? '隐藏提示' : '显示提示'}
            </button>
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
            >
              {showSolution ? '隐藏答案' : '显示答案'}
            </button>
          </div>
          <button
            onClick={resetExercise}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            重置
          </button>
        </div>

        {/* 验证结果 */}
        {validationResult && (
          <div className={`p-4 rounded-lg ${
            validationResult.isValid 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center">
              <span className={`mr-2 ${
                validationResult.isValid ? 'text-green-600' : 'text-red-600'
              }`}>
                {validationResult.isValid ? '✓' : '✗'}
              </span>
              <span className={`text-sm font-medium ${
                validationResult.isValid ? 'text-green-800' : 'text-red-800'
              }`}>
                {validationResult.message}
              </span>
            </div>
          </div>
        )}

        {/* 提示 */}
        {showHints && hints.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 提示</h4>
            <ul className="space-y-1">
              {hints.map((hint, index) => (
                <li key={index} className="text-blue-800 text-sm flex items-start">
                  <span className="mr-2">•</span>
                  {hint}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 解决方案 */}
        {showSolution && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-yellow-50 px-4 py-2 border-b border-yellow-200">
              <h4 className="font-medium text-yellow-900">参考解决方案</h4>
            </div>
            <SyntaxHighlighter
              language={language}
              style={tomorrow}
              customStyle={{
                margin: 0,
                fontSize: '14px',
                background: '#f8fafc'
              }}
              showLineNumbers
            >
              {solution}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  );
};

interface InteractiveTutorialProps {
  title: string;
  steps: Array<{
    title: string;
    content: string;
    code?: string;
    language?: string;
  }>;
}

export const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({
  title,
  steps
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const completeStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center mt-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                index === currentStep
                  ? 'bg-blue-600 text-white'
                  : completedSteps.includes(index)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {completedSteps.includes(index) ? '✓' : index + 1}
            </button>
          ))}
          <div className="ml-4 text-sm text-gray-600">
            步骤 {currentStep + 1} / {steps.length}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            {steps[currentStep].title}
          </h4>
          <p className="text-gray-600">{steps[currentStep].content}</p>
        </div>

        {steps[currentStep].code && (
          <div className="mb-6">
            <InteractiveCodeEditor
              initialCode={steps[currentStep].code}
              language={steps[currentStep].language || 'python'}
              readOnly={true}
              height="200px"
            />
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← 上一步
          </button>
          <button
            onClick={completeStep}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentStep === steps.length - 1 ? '完成教程' : '下一步 →'}
          </button>
        </div>
      </div>
    </div>
  );
};