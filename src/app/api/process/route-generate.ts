import { NextResponse } from 'next/server';
import ollama from 'ollama';

// // 假设这是调用本地大语言模型的函数
// async function processWithLocalLLM(text: string) {
//   try {
//     // 使用Ollama库调用本地大语言模型
//     const response = await ollama.generate({
//       model: "qwen2.5:3b", // 使用的模型名称,根据实际情况修改
//       prompt: text,
//       stream: false
//     });


//     // 返回模型生成的结果
//     return response.response;
//   } catch (error) {
//     console.error('调用Ollama API时发生错误:', error);
//     throw new Error('处理文本失败');
//   }
// }

export async function POST(request: Request) {
  const { text } = await request.json();

  try {
    const apiResponse = await ollama.generate({
      model: "qwen2.5:3b",
      prompt: text,
      stream: false
    });

    return NextResponse.json({
      result: apiResponse.response,
      apiResponse: apiResponse // 返回完整的API响应
    });
  } catch (error) {
    console.error('处理文本时发生错误:', error);
    return NextResponse.json({ error: '处理文本失败' }, { status: 500 });
  }
}
