'use client'

import { useState } from 'react';
import * as acorn from 'acorn';

export default function RecursiveInput({ onSubmit }) {
  const [inputCodeString, setInputCodeString] = useState('');
  const [inputArgsString, setInputArgsString] = useState('');

  const handleSubmit = () => {
    const inputCodeLines = inputCodeString.split('\n')

    const ast = acorn.parse(inputCodeString, { ecmaVersion: 2020 });

    const inputCodeElements = {
      functionName: ast.body[0].id.name,
      functionParams: ast.body[0].params.map(param => param.name),
      conditionBasicCaseStr: inputCodeLines[1],
      processBasicCaseStr: inputCodeLines[2],
      processRecursiveCaseStr: inputCodeLines[5],
    }

    function addCallerIdToFunctionCalls(code, functionName) {
      // Tạo biểu thức chính quy để tìm tất cả các xuất hiện của 'functionName('
      const regex = new RegExp(functionName + '\\(', 'g');

      // Thay thế tất cả các 'functionName(' bằng 'functionName(callerId, '
      const updatedCode = code.replace(regex, functionName + '(callerId = currentId, ');

      return updatedCode;
    }

    function createWrapperFunctionString(inputCodeElements, inputArgsString) {
      const functionName = inputCodeElements.functionName;
      const functionParams = inputCodeElements.functionParams;
      const functionParamsString = functionParams.join(',');
      const paramsObjectString = functionParams.map(param => `${param}: ${param}, `).join('');
      const processRecursiveCaseStr = inputCodeElements.processRecursiveCaseStr;

      const processRecursiveCaseWithCallerIdStr = addCallerIdToFunctionCalls(processRecursiveCaseStr, functionName);


      const wrapperFunctionString = `
        function wrapperFunction() {
          let id = 0;

          let dataTrace = [];
        
            function ${functionName} (callerId = null, ${functionParamsString}) {
              const currentId = id++;
              dataTrace.push({ ${paramsObjectString} type: 'call', id: currentId, callerId: callerId })
              ${inputCodeElements.conditionBasicCaseStr}
              ${inputCodeElements.processBasicCaseStr}
                dataTrace.push({ ${paramsObjectString} type: 'return', result: result, id: currentId, callerId: currentId })
                return result;
              }
              ${processRecursiveCaseWithCallerIdStr}
              dataTrace.push({ ${paramsObjectString} type: 'return', result: result, id: currentId, callerId: currentId })
              return result;
          }
        
          ${functionName}(null, ${ inputArgsString });
        
          return dataTrace;
        }

        wrapperFunction();
        `

      return wrapperFunctionString;
    }

    const wrapperFunctionString = createWrapperFunctionString(inputCodeElements, inputArgsString)

    
    try {
      const result = eval(wrapperFunctionString);
      console.log(result);
      onSubmit({ result });
    } catch (error) {
      console.error('Error executing code:', error);
    }
  };

  return (
    <div>
      <textarea
        value={inputCodeString}
        onChange={(e) => setInputCodeString(e.target.value)}
        placeholder="Nhập hàm đệ quy của bạn ở đây..."
      />
      <input
        value={inputArgsString}
        onChange={(e) => setInputArgsString(e.target.value)}
        placeholder="Nhập args theo thứ tự. Ví dụ: 5,10"
      />
      <button onClick={handleSubmit}>Thực thi</button>
    </div>
  );
}
