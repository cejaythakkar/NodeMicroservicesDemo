import { FileValidity } from "../../types";
import path from "path";
import * as XLSX from "xlsx";
import { FileInspectionRow } from '../../types'

export default function checkFileValidity(file: any): FileValidity {
    if (!file) {
        return {
            isValid: false,
            message: "File not Provided."
        } as FileValidity
    }

    const fileExtension = path.extname(file.originalname).toLowerCase();

    const allowedExtensions = [".csv", ".xls", ".xlsx"];

    if (!allowedExtensions.includes(fileExtension)) {
        return { isValid: false, message: "CSV, XLS, and XLSX files only." } as FileValidity
    }

    const workbook = XLSX.read(file.buffer, {
        type: "buffer",
        cellDates: true
    });

    const firstSheetName = workbook.SheetNames[0];

    const firstSheet = workbook.Sheets[firstSheetName];

    const rows = XLSX.utils.sheet_to_json<FileInspectionRow>(
        firstSheet,
        {
            defval: "",
            raw: false,
            dateNF: "dd-mm-yyyy"
        }
    );

    if (rows.length === 0) {
        return { isValid: false, message: "File has no records" } as FileValidity

    }

    return { isValid: true, rows: rows }
}
