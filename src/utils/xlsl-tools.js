import * as XLSX from "xlsx";

export const readFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.onerror = (error) => {
      reject({ error });
    };
  });
};
export const sheetToJson = async (data) => {
  try {
    // 读取Excel文件
    const workbook = XLSX.read(data, { type: "array" });
    // 获取第一个工作表
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    // 将工作表转换为JSON
    return XLSX.utils.sheet_to_json(worksheet);
  } catch (error) {
    console.error("处理Excel文件时出错:", error);
    return error;
  }
};
