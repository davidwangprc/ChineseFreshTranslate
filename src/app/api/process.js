"use client";

// 假设这是调用本地大语言模型的函数
async function processWithLocalLLM(text) {
  // 这里应该是实际调用本地大语言模型的代码
  // 现在我们只返回一个模拟的结果
  return `处理结果: ${text.length} 个字符`;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { text } = req.body;
      const result = await processWithLocalLLM(text);
      res.status(200).json({ result });
    } catch (error) {
      console.error('处理文本时发生错误:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
