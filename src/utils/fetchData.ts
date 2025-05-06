export async function getData(url: string){
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengambil data");
    }
    const data = await response.json();
    return data;
}

export async function postData(insertedData: any, url: string){
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(insertedData),
    });

    const data = await response.json()

    if (!response.ok) {
        throw data;
    }

    return data;
}

export async function putData(idRecord: any, updatedData: any, url: string){
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}?idRecord=${idRecord}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    });

    const data = await response.json()

    if (!response.ok) {
        throw data;
    }

    return data;
}

export async function deleteData(idRecord: any, url: string){
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}?idRecord=${idRecord}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        }
    });

    const data = await response.json()

    if (!response.ok) {
        throw data;
    }

    return data;
}


export async function branch() {
    const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || '';
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/branch`);
    const branches = await response.json();
    if (!response.ok) {
        throw new Error(branches.message || "Gagal mengambil data cabang");
    }
    return branches;
}

export async function department() {
    const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || '';
    const data = await fetch(`${NEXT_PUBLIC_API_URL}/api/dept`);
    const departments = await data.json();
    if (data.status !== 200) {
        throw new Error(departments.message || 'Gagal mengambil data departemen');
    }
    return departments;
}

export async function position() {
    const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || '';
    const data = await fetch(`${NEXT_PUBLIC_API_URL}/api/position`);
    const positions = await data.json();
    if (data.status !== 200) {
        throw new Error(positions.message || 'Gagal mengambil data posisi');
    }
    return positions;
}

export async function level() {
    const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || '';
    const data = await fetch(`${NEXT_PUBLIC_API_URL}/api/level`);
    const levels = await data.json();
    if (data.status !== 200) {
        throw new Error(levels.message || 'Gagal mengambil data level');
    }
    return levels;
}

export async function getdatakaryawan(nik:any) {
    const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || '';
    const data = await fetch(`${NEXT_PUBLIC_API_URL}/api/datakaryawan/${nik}`);
    const datakaryawan = await data.json();
    if (data.status !== 200) {
        throw new Error(datakaryawan.message || 'Gagal mengambil data karyawan');
    }
    return datakaryawan;
}

export async function updateDataKaryawan(nik: string, updatedData: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/datakaryawan/${nik}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    });

    const data = await response.json()

    if (!response.ok) {
        throw data;
    }

    return data;
}

export async function getDashboardKaryawan(nik: string){
    const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || '';
    const res = await fetch(`${NEXT_PUBLIC_API_URL}/api/employeedashboard/${nik}`);
    const datakaryawan = await res.json();
    if(!res.ok){
        throw datakaryawan;
    }
    return datakaryawan;
}


export async function getCareerPath() {
    const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || '';
    const data = await fetch(`${NEXT_PUBLIC_API_URL}/api/careerpath`);
    const careerPath = await data.json();
    if (data.status !== 200) {
        throw new Error(careerPath.message || "Gagal mengambil data career path");
    }
    return careerPath;
}

export async function postCareerPath(insertedData: any){
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/careerpath`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(insertedData),
    });

    const data = await response.json()

    if (!response.ok) {
        throw data;
    }

    return data;
}