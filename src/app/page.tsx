"use client"

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import './globals.css'


interface ParsedContent {
  input: string;
  output_en: string;
  output_jp: string;
  output_explain: string;
  pinyin: string;
}

const getRandomColor = () => {
  const colors = [
    '--primary-color',
    '--secondary-color',
    '--accent-color',
    '--background-color',
    '--text-color',
    '--light-text-color',
    '--divider-color'
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return `var(${colors[randomIndex]})`;
};

export default function Home() {
  // 定义状态变量来存储用户输入的中文文本和处理结果
  const [chineseText, setChineseText] = useState('');
  const [parsedResult, setParsedResult] = useState<ParsedContent | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [backgroundColor, setBackgroundColor] = useState('');

  useEffect(() => {
    setBackgroundColor(getRandomColor());
  }, []);

  // 处理表单提交的异步函数
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 阻止表单默认提交行为
    try {
      // 向API发送POST请求
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: chineseText }),
      });

      // 检查响应状态
      if (!response.ok) {
        throw new Error('API请求失败');
      }

      // 解析响应数据
      const data = await response.json();
      setApiResponse(data.apiResponse);

      // 解析message.content
      const contentObj = JSON.parse(data.apiResponse.message.content);
      setParsedResult(contentObj);
    } catch (error) {
      console.error('错误:', error);
      setParsedResult(null);
      setApiResponse(null);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>汉语新解</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            value={chineseText}
            onChange={(e) => setChineseText(e.target.value)} // 更新输入文本状态
            rows={4}
            placeholder="请输入中文文本"
            className={styles.textarea}
          />
          <button type="submit" className={styles.button}>说吧，他们又用哪个词来忽悠你了？</button>
        </form>

        {/* 渲染解析后的结果 */}
        {parsedResult && (
          <div className="explacard">
            <div className="explaheader">
              <h1>汉语新解</h1>
            </div>
            <div className="explacontent">
              <div className="explaword">
                <p className="explasub">{parsedResult.pinyin}</p>
                <p className="explamain">{parsedResult.input}</p>
                <p className="explasub>">{parsedResult.output_en}</p>
                <p className="explasub>">{parsedResult.output_jp}</p>
              </div>
              <div className="expladivider"></div>
              <div className="expla">
                <div className="quote">
                  <p>{parsedResult.output_explain}</p>
                </div>
              </div>
              <div className="background-text">{parsedResult.input}</div>
            </div>
          </div>
        )}

        {/* 显示API响应的详细信息 */}
        {apiResponse && (
          <div className={styles.result}>
            <h2>API响应详情:</h2>
            <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
          </div>
        )}
      </main>
    </div>
  );
}
