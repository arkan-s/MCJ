export function nikGenerate(nik: string) {
    const cleanedNik = nik.replace(/\D/g, '');
    if (cleanedNik.length === 0) {
        throw new Error("NIK tidak boleh kosong dan harus mengandung angka.");
    }
    let tempNIK = "9" + cleanedNik + "9";
    let multiplied = parseInt(tempNIK, 10) * 2;
    let newNIK = String(multiplied).slice(0, -1);
    return newNIK;
}

export function nikRevealer(nik: string) {
    const tempNIK = Math.floor(parseInt("1824691357") / 2);
    const realNIK = tempNIK.toString().slice(1);
    return realNIK;
}