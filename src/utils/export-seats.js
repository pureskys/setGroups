import {
    AlignmentType,
    Document,
    Packer,
    PageOrientation,
    Paragraph,
    Table,
    TableCell,
    TableRow,
    TextRun,
    WidthType
} from "docx";

export const exportToWord = async (Data, rowCount, cols,) => {
    // 创建表格行
    const tableRows = [];
    let key = Data.length  // 标记循环停止时机
    console.log(key)
    // 添加数据行
    for (let i = 0; i < rowCount + 99; i++) {
        const rowCells = [];

        for (let j = 0; j < cols; j++) {
            const index = i * cols + j;

            if (index >= key) break;
            try {
                const student = Data[index][0];
                rowCells.push(
                    new TableCell(
                        {
                            children: [new Paragraph({
                                children: [new TextRun({
                                    text: student.姓名,
                                    font: "宋体",
                                    size: 36, // 小二=16磅=32缇
                                })],
                                alignment: AlignmentType.CENTER,
                            }),],
                            verticalAlign: "center" // 垂直居中
                        })
                );
            } catch (e) {
                rowCells.push(
                    new TableCell(
                        {
                            children: [new Paragraph('')],
                            verticalAlign: "center" // 垂直居中
                        })
                );
            }

        }

        tableRows.push(new TableRow({
            children: rowCells, height: {
                value: 907,
                rule: "exact" // 固定高度
            }
        }));
    }
    // 添加讲台行（合并所有列的单元格）
    tableRows.push(new TableRow({
        children: [
            new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({
                        text: "讲台",
                        font: '黑体',
                        size: 40,
                        bold: true // 加粗显示
                    })],
                    alignment: AlignmentType.CENTER,
                })],
                verticalAlign: "center",
                columnSpan: cols, // 合并所有列
                shading: { // 添加浅灰色背景
                    fill: "DDDDDD"
                },
            })
        ],
        height: {
            value: 1200,
            rule: "exact"
        }
    }));
    // 创建文档
    const doc = new Document({
        styles: {
            default: {
                document: {
                    paragraph: {
                        alignment: AlignmentType.CENTER // 全局段落居中
                    }
                }
            }
        },
        sections: [
            {
                properties: {
                    page: {
                        size: {
                            orientation: PageOrientation.LANDSCAPE // 设置为横版
                        },
                        margin: {
                            top: 1500,
                            right: 1000,
                            bottom: 1500,
                            left: 1000,
                        }
                    }
                },
                children: [
                    new Table({
                        rows: tableRows,
                        alignment: 'center',
                        width: {size: 100, type: WidthType.PERCENTAGE}, // 表格宽度100%
                    }),
                ],
            },
        ],
    });

    // 生成Word文档并下载
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "座次表.docx";
    link.click();
    URL.revokeObjectURL(url);
}