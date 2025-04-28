export async function putData(nik: string, idRecord: any, updatedData: any, url: string){
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee/${nik}${url}/${idRecord}`, {
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