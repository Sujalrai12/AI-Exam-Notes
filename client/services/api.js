import { serverUrl } from "../src/App"
import axios from "axios"
import { setUserData } from "../src/redux/userSlice"


export const getCurrentUser = async (dispatch)=>{
    try{
        const result = await axios.get(serverUrl + "/api/user/currentuser",{ withCredentials: true})
        console.log(result.data)
        dispatch(setUserData(result.data))
    }
    catch (error){
        console.log(error.message)
    }
}

export const generateNotes = async (payload) =>{
    try {
        const result = await axios.post(serverUrl+ "/api/notes/generate-notes", payload, {withCredentials:true})
        console.log(result.data)
        return result.data
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || "Failed to generate notes")
    }

}

export const generateQuickQuiz = async (noteId) => {
    try {
        const result = await axios.post(`${serverUrl}/api/notes/${noteId}/quick-quiz`, {}, { withCredentials: true })
        return result.data.quickQuiz
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || "Failed to generate quiz")
    }
}

const downloadBlob = (blob, fileName) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
};

export const downloadPdf = async (result) => {
    const requestedName = window.prompt("Save PDF as:", "ExamNotesAI.pdf");
    if (requestedName === null) return;

    let fileName = requestedName.trim() || "ExamNotesAI.pdf";
    if (!/\.pdf$/i.test(fileName)) fileName += ".pdf";

    let response;
    try {
        response = await axios.post(serverUrl + "/api/pdf/generate-pdf", { result },
            { responseType: "blob", withCredentials: true }
        );
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || "PDF generation failed");
    }

    const blob = new Blob([response.data], { type: "application/pdf" });
    downloadBlob(blob, fileName);
}
