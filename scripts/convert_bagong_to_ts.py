#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
将八宫六十四卦Excel表格转换为TypeScript数据文件
"""

import json
import re
import sys
import os

try:
    import pandas as pd
except ImportError:
    print("正在安装pandas和openpyxl...")
    os.system("pip install pandas openpyxl -q")
    import pandas as pd

def convert_excel_to_ts(excel_path: str, output_path: str):
    """读取Excel文件并转换为TypeScript格式"""
    
    print(f"正在读取Excel文件: {excel_path}")
    
    try:
        # 读取Excel文件
        df = pd.read_excel(excel_path)
        
        print(f"成功读取 {len(df)} 行数据")
        print(f"列名: {df.columns.tolist()}")
        
        # 显示前几行数据以便检查
        print("\n前3行数据预览:")
        print(df.head(3))
        
        # 直接使用列名映射（根据实际Excel列名）
        hexagram_data = []
        
        for idx, row in df.iterrows():
            try:
                # 序号
                number = int(row['序号']) if pd.notna(row['序号']) else idx + 1
                
                # 卦名 - 清理后缀
                chinese_name = str(row['卦名']).strip() if pd.notna(row['卦名']) else ""
                if chinese_name:
                    # 移除"为天"、"为地"等后缀
                    chinese_name = re.sub(r'为[天地雷风水火山泽]', '', chinese_name)
                    # 移除括号内容
                    chinese_name = re.sub(r'[（(].*?[）)]', '', chinese_name).strip()
                
                # 卦宫 - 提取宫名
                palace_str = str(row['卦宫']).strip() if pd.notna(row['卦宫']) else ""
                palace = ""
                for 宫名 in ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']:
                    if 宫名 in palace_str:
                        palace = 宫名
                        break
                
                # 五行属性
                element = str(row['五行属性']).strip() if pd.notna(row['五行属性']) else ""
                
                # 世爻位 - 转换为数字
                shi_yao_str = str(row['世爻位']).strip() if pd.notna(row['世爻位']) else ""
                shi_yao = None
                if '初' in shi_yao_str:
                    shi_yao = 0
                elif '二' in shi_yao_str and '游' not in shi_yao_str and '归' not in shi_yao_str:
                    shi_yao = 1
                elif '三' in shi_yao_str and '游' not in shi_yao_str and '归' not in shi_yao_str:
                    shi_yao = 2
                elif '四' in shi_yao_str:
                    shi_yao = 3
                elif '五' in shi_yao_str:
                    shi_yao = 4
                elif '上' in shi_yao_str or '六' in shi_yao_str:
                    shi_yao = 5
                else:
                    shi_yao = 5  # 默认值
                
                # 纳甲地支序列 - 提取地支
                najia_str = str(row['纳甲地支序列（从初爻到上爻）']).strip() if pd.notna(row['纳甲地支序列（从初爻到上爻）']) else ""
                # 使用正则提取所有地支
                na_jia_sequence = re.findall(r'[子丑寅卯辰巳午未申酉戌亥]', najia_str)
                if len(na_jia_sequence) != 6:
                    print(f"警告: 第{idx+1}行({chinese_name})纳甲地支数量不正确: {len(na_jia_sequence)}, 原始: {najia_str}")
                    # 如果提取的地支不足6个，尝试补全
                    if len(na_jia_sequence) == 0:
                        na_jia_sequence = ["子", "寅", "辰", "午", "申", "戌"]  # 默认值
                
                # 验证必需字段
                if not chinese_name:
                    print(f"警告: 第{idx+1}行缺少卦名，跳过")
                    continue
                
                if not palace:
                    print(f"警告: 第{idx+1}行({chinese_name})缺少卦宫")
                
                if shi_yao is None:
                    print(f"警告: 第{idx+1}行({chinese_name})世爻位解析失败: {shi_yao_str}")
                    shi_yao = 5  # 使用默认值
                
                hexagram_data.append({
                    "number": number,
                    "chineseName": chinese_name,
                    "palace": palace,
                    "element": element,
                    "shiYao": shi_yao,
                    "naJiaSequence": na_jia_sequence[:6]  # 确保只有6个
                })
                
            except Exception as e:
                print(f"处理第{idx+1}行时出错: {e}")
                print(f"行数据: {row.to_dict()}")
                import traceback
                traceback.print_exc()
                continue
        
        print(f"\n✅ 成功解析 {len(hexagram_data)} 个卦象数据")
        
        if len(hexagram_data) == 0:
            print("❌ 没有成功解析任何数据，请检查Excel文件格式")
            return False
        
        # 生成TypeScript代码
        ts_content = '''/**
 * 八宫六十四卦详细数据
 * 包含：卦宫、五行、世爻位、纳甲地支序列
 * 
 * 数据来源：public/bagongliushisi.xlsx
 * 生成时间：''' + pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S') + '''
 */

export interface HexagramPalaceData {
  /** 卦序号（1-64） */
  number: number;
  
  /** 中文卦名 */
  chineseName: string;
  
  /** 卦宫归属（八宫之一） */
  palace: '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤';
  
  /** 五行属性 */
  element: '金' | '木' | '水' | '火' | '土';
  
  /** 世爻位置（0-5，对应初爻到上爻） */
  shiYao: number;
  
  /** 纳甲地支序列（6个地支，对应6个爻位） */
  naJiaSequence: [string, string, string, string, string, string];
}

export const hexagramPalaceData: HexagramPalaceData[] = ''' + json.dumps(hexagram_data, ensure_ascii=False, indent=2) + ';'
        
        # 写入文件
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(ts_content)
        
        print(f"\n✅ 成功生成TypeScript数据文件: {output_path}")
        print(f"   共 {len(hexagram_data)} 个卦象数据")
        
        # 验证数据
        print("\n📊 数据验证:")
        numbers = [h['number'] for h in hexagram_data]
        print(f"  卦序号范围: {min(numbers)} - {max(numbers)}")
        
        palace_dist = {}
        for h in hexagram_data:
            palace = h['palace']
            palace_dist[palace] = palace_dist.get(palace, 0) + 1
        print(f"  卦宫分布: {palace_dist}")
        
        element_dist = {}
        for h in hexagram_data:
            elem = h['element']
            element_dist[elem] = element_dist.get(elem, 0) + 1
        print(f"  五行分布: {element_dist}")
        
        # 检查纳甲序列完整性
        najia_errors = [h for h in hexagram_data if len(h['naJiaSequence']) != 6]
        if najia_errors:
            print(f"  ⚠️ 纳甲序列不完整: {len(najia_errors)} 个")
            for err in najia_errors[:3]:  # 只显示前3个
                print(f"    - {err['chineseName']}: {len(err['naJiaSequence'])} 个地支")
        else:
            print(f"  ✅ 所有纳甲序列完整（6个地支）")
        
        return True
        
    except Exception as e:
        print(f"❌ 读取Excel文件失败: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    excel_path = r'E:\windsurf-xuan\public\bagongliushisi.xlsx'
    output_path = r'E:\windsurf-xuan\src\features\dilemma\data\hexagramPalaceData.ts'
    
    success = convert_excel_to_ts(excel_path, output_path)
    sys.exit(0 if success else 1)
