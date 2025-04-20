// src/utils/wordExporter.js
import {saveAs} from 'file-saver';
import {Document, HeadingLevel, Packer, Paragraph, TextRun} from 'docx';

/**
 * 导出群组数据为Word文档
 * @param {Object} groupData - 群组数据，包含group_name和group_list
 * @param {string} [fileName] - 可选，自定义文件名(不带后缀)
 * @returns {Promise<void>}
 */
export async function exportGroupToWord(groupData, fileName) {
    if (!groupData || !groupData.group_name || !groupData.group_list) {
        throw new Error('无效的群组数据');
    }

    // 创建文档内容
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    text: groupData.group_name,
                    heading: HeadingLevel.HEADING_1,
                    spacing: {after: 200}
                }),
                new Paragraph({
                    text: "成员列表：",
                    heading: HeadingLevel.HEADING_2,
                    spacing: {after: 100}
                }),
                ...generateMemberParagraphs(groupData.group_list)
            ]
        }]
    });

    // 生成Word文档并下载
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${fileName || groupData.group_name}_成员名单.docx`);
}

/**
 * 生成成员段落（仅标记重复成员）
 * @param {Array} memberList - 成员列表
 * @returns {Array} 段落数组
 */
function generateMemberParagraphs(memberList) {
    // 统计每个成员的出现次数
    const memberCounts = {};
    memberList.forEach(member => {
        const name = member.姓名;
        memberCounts[name] = (memberCounts[name] || 0) + 1;
    });

    // 去重并生成段落
    const uniqueMembers = [...new Set(memberList.map(m => m.姓名))];
    return uniqueMembers.map(name => {
        const isRepeated = memberCounts[name] > 1;

        return new Paragraph({
            children: [
                new TextRun({
                    text: name,
                    bold: true
                }),
                ...(isRepeated ? [
                    new TextRun({
                        text: ` (出现${memberCounts[name]}次)`,
                        bold: false
                    })
                ] : [])
            ],
            spacing: {after: 50}
        });
    });
}