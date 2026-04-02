import type { VercelRequest, VercelResponse } from '@vercel/node';

const FEISHU_APP_ID = 'cli_a94743228b3cdbd7';
const FEISHU_APP_SECRET = 'BqU8gMqbGADbMKxdiq7JeeexM7YrVyhA';
const BITABLE_APP_TOKEN = 'Wou1b0kDqacUp5sr8fqcJmzinqc';
const BITABLE_TABLE_ID = 'tbl3AfpI9Z343xr8';

async function getFeishuToken(): Promise<string> {
  const res = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: FEISHU_APP_ID, app_secret: FEISHU_APP_SECRET })
  });
  const data = await res.json();
  return data.tenant_access_token;
}

async function addRecord(fields: Record<string, any>, token: string) {
  const res = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${BITABLE_APP_TOKEN}/tables/${BITABLE_TABLE_ID}/records`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields })
  });
  return await res.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  try {
    const { name, wechat, purpose } = req.body;
    
    if (!name || !wechat) {
      res.status(400).json({ success: false, message: '姓名和微信不能为空' });
      return;
    }

    const token = await getFeishuToken();
    
    // 获取当前时间
    const now = new Date();
    const timestamp = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const result = await addRecord({
      '姓名': name,
      '微信': wechat,
      '使用目的': purpose || '',
      '注册时间': timestamp
    }, token);

    if (result.msg === 'success') {
      res.status(200).json({ success: true, message: '注册成功' });
    } else {
      console.error('飞书写入失败:', result);
      res.status(500).json({ success: false, message: '写入失败' });
    }
  } catch (error: any) {
    console.error('注册错误:', error);
    res.status(500).json({ success: false, message: error.message || '服务器错误' });
  }
}
