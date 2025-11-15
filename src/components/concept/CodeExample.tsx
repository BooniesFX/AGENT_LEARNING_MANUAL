import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CodeExample } from '../../types';

interface CodeExampleProps {
  example: CodeExample;
  showOutput?: boolean;
}

export const CodeExampleDisplay: React.FC<CodeExampleProps> = ({ example, showOutput = true }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(example.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900">{example.title}</h4>
          {example.description && (
            <p className="text-sm text-gray-600 mt-1">{example.description}</p>
          )}
        </div>
        <button
          onClick={copyToClipboard}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
        >
          {copied ? '已复制!' : '复制代码'}
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={example.language}
          style={tomorrow}
          customStyle={{
            margin: 0,
            fontSize: '14px',
            background: '#f8fafc'
          }}
          showLineNumbers
        >
          {example.code}
        </SyntaxHighlighter>
      </div>

      {showOutput && example.output && (
        <div className="border-t border-gray-200">
          <div className="bg-green-50 px-4 py-2 border-b border-green-200">
            <h5 className="text-sm font-medium text-green-800">输出结果：</h5>
          </div>
          <div className="p-4 bg-gray-900 text-green-400 font-mono text-sm">
            <pre>{example.output}</pre>
          </div>
        </div>
      )}

      {example.explanation && (
        <div className="border-t border-gray-200 bg-blue-50 px-4 py-3">
          <h5 className="text-sm font-medium text-blue-800 mb-2">代码说明：</h5>
          <p className="text-sm text-blue-700">{example.explanation}</p>
        </div>
      )}
    </div>
  );
};

interface MultiCodeExampleProps {
  examples: CodeExample[];
  title?: string;
}

export const MultiCodeExample: React.FC<MultiCodeExampleProps> = ({ examples, title }) => {
  const [activeExample, setActiveExample] = useState(0);

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      )}
      
      {examples.length > 1 && (
        <div className="flex space-x-2 border-b border-gray-200">
          {examples.map((example, index) => (
            <button
              key={example.id}
              onClick={() => setActiveExample(index)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeExample === index
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {example.title}
            </button>
          ))}
        </div>
      )}

      <CodeExampleDisplay
        example={examples[activeExample]}
        showOutput={true}
      />
    </div>
  );
};