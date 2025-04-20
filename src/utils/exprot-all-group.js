// src/utils/wordExporter.js
import {saveAs} from 'file-saver';
import {Document, HeadingLevel, Packer, Paragraph, TextRun} from 'docx';

/**
 * 导出所有分组数据为Word文档
 * @param {Array} groupsData - 分组数据数组
 * @param {string} [fileName] - 可选，自定义文件名(不带后缀)
 * @returns {Promise<void>}
 */
export async function exportAllGroupsToWord(groupsData, fileName) {
    if (!Array.isArray(groupsData)) {
        throw new Error('数据格式错误：需要数组格式的分组数据');
    }

    // 创建文档内容
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // 文档标题
                new Paragraph({
                    text: "分组成员总表",
                    heading: HeadingLevel.HEADING_1,
                    spacing: {after: 300}
                }),
                // 所有分组内容
                ...generateAllGroupsContent(groupsData)
            ]
        }]
    });

    // 生成Word文档并下载
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${fileName || '分组成员总表'}.docx`);
}

/**
 * 生成所有分组内容
 * @param {Array} groupsData - 分组数据数组
 * @returns {Array} 文档内容数组
 */
function generateAllGroupsContent(groupsData) {
    return groupsData.flatMap((group, index) => {
        if (!group.group_name || !Array.isArray(group.group_list)) {
            console.warn(`无效的分组数据，索引: ${index}`);
            return [];
        }

        return [
            // 分组标题
            new Paragraph({
                text: `${index + 1}. ${group.group_name}`,
                heading: HeadingLevel.HEADING_2,
                spacing: {before: 400, after: 150}
            }),

            // 成员数量统计
            new Paragraph({
                text: `成员总数: ${group.group_list.length}人`,
                spacing: {after: 100}
            }),

            // 成员列表
            ...generateMemberList(group.group_list),

            // 分页符（最后一个分组不加）
            ...(index < groupsData.length - 1 ? [
                new Paragraph({
                    children: [new TextRun({text: "", break: 1})]
                })
            ] : [])
        ];
    });
}

/**
 * 生成成员列表段落
 * @param {Array} memberList - 成员列表
 * @returns {Array} 段落数组
 */
function generateMemberList(memberList) {
    // 统计成员出现次数
    const memberCounts = memberList.reduce((acc, {姓名}) => {
        acc[姓名] = (acc[姓名] || 0) + 1;
        return acc;
    }, {});

    // 去重并按字母顺序排序
    const uniqueMembers = [...new Set(memberList.map(m => m.姓名))]
        .sort((a, b) => a.localeCompare(b));

    // 创建成员列表段落
    return uniqueMembers.map(name => {
        const isRepeated = memberCounts[name] > 1;

        return new Paragraph({
            children: [
                new TextRun({
                    text: name,
                    size: 22
                }),
                ...(isRepeated ? [
                    new TextRun({
                        text: ` (出现${memberCounts[name]}次)`,
                        size: 22,
                        color: '666666'
                    })
                ] : [])
            ],
            indent: {left: 400}, // 缩进
            spacing: {after: 80}
        });
    });
}