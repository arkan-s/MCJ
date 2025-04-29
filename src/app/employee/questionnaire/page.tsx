'use client';
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getdatakaryawan, updateDataKaryawan } from "@/utils/fetchData";
import Image from "next/image";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import * as contextHooks from "@/hooks/context/questionnairecontext"
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from 'next/navigation';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { createId } from "@paralleldrive/cuid2";



export default function QuestionnaireForm () {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const router = useRouter();

    if(session?.user.questionnaire === 1){
        return (
            <div className={`text-xl text-gray-800 md:text-3xl md:leading-normal flex flex-col justify-center items-center h-screen bg-blue-50 w-full`}>
                <Image src="/image/logo-icbp.png" alt="logo icbp" width={300} height={60} />
                <h2 className="mt-4 text-center">Terima kasih karena sudah mengisi questionnaire anda.</h2>
            </div>
        )
    }

    const { data: careerData, isLoading: careerLoading, isError: careerError } = useQuery({
        queryKey: ["careerHistory", session?.user.nik],
        queryFn: async () => {
            const res = await fetch(`/api/datakaryawan/${session?.user.nik}/datariwayatkarir`);
            if (!res.ok) {
                throw new Error("Failed to fetch career history data");
            }
            return await res.json();
        },
        retry: 3,
        retryDelay: attemptIndex => attemptIndex * 1500,
        enabled: !!session?.user.nik,
    });

    const { data: dataKaryawan, isLoading: karyawanLoading, isError: karyawanError } = useQuery({
        queryKey: ['datakaryawan'],
        queryFn: () => getdatakaryawan(session?.user?.nik),
        refetchOnWindowFocus: false,
        enabled: !!session?.user?.nik,
        retry: 3, 
        retryDelay: attemptIndex => Math.min(1000 * 1 ** attemptIndex, 30000),
    })

    const { data: dataQuestionnaires, isLoading: questionnairesLoading, isError: questionnairesError } = useQuery({
        queryKey: ['questionnaire'],
        queryFn: async () => {
            const res = await fetch(`/api/questionnaires/${dataKaryawan?.personnelSubarea}/${dataKaryawan?.position}`)
            if (!res.ok) throw new Error('Network response was not ok')
            const data = await res.json()
            return data
        },
        enabled: !!dataKaryawan,
        refetchOnWindowFocus: false,
        retry: 3, 
        retryDelay: attemptIndex => Math.min(1000 * 1 ** attemptIndex, 30000),
    })

    const { questionnaires, setQuestionnaires } = contextHooks.useTemplateForm();

    useEffect(() => {
        if (
            dataQuestionnaires &&
            !questionnairesLoading &&
            !questionnairesError &&
            questionnaires.length === 0
        ) {
        const initialized = dataQuestionnaires.map((form: any) => ({
            IDForm: form.idForm,
            TitleForm: form.titleForm,
            DescForm: form.descForm,
            AssessmentType: form.AssessmentType.map((assessmen: any) => ({
                IDAssessment: assessmen.idAssessmentType,
                TitleAssessment: assessmen.titleAT,
                DescAssessment: assessmen.descAT,
                TypeAssessment: assessmen.typeAT,
                Ques: assessmen.Questions.map((q: any) => ({
                    IDQue: q.idQuestion,
                    TitleQue: q.titleQue,
                    DescQue: q.Question,
                    answer: null,
                })),
            })),
        }));
        
        setQuestionnaires(initialized);
        }
    }, [dataQuestionnaires, questionnaires, questionnairesLoading, questionnairesError, setQuestionnaires]);
    
    const mutationFn = async () => {
        // 1. Ambil dari cache
        let prev_data: any = queryClient.getQueryData(['datakaryawan']);

        if (!prev_data) {
            prev_data = await queryClient.fetchQuery({
                queryKey: ['datakaryawan'],
                queryFn: () => getdatakaryawan(session?.user.nik),
                retry: 3, 
                retryDelay: attemptIndex => Math.min(1000 * 1 ** attemptIndex, 30000),
                staleTime: Infinity,
            });
        }

        // 2. Transform datanya
        const updatedData = {
            namaKaryawan: prev_data.namaKaryawan,
            tanggalLahir: prev_data.tanggalLahir,
            tanggalMasukKerja: prev_data.tanggalMasukKerja,
            gender: prev_data.gender,
            personnelArea: prev_data.personnelArea,
            position: prev_data.position,
            personnelSubarea: prev_data.personnelSubarea,
            levelPosition: prev_data.levelPosition,
            pend: prev_data.pend,
            namaSekolah: prev_data.namaSekolah,
            namaJurusan: prev_data.namaJurusan,
            age: (new Date().getTime() - new Date(prev_data.tanggalLahir).getTime()) / (1000 * 60 * 60 * 24 * 365.25),
            lengthOfService: (new Date().getTime() - new Date(prev_data.tanggalMasukKerja).getTime()) / (1000 * 60 * 60 * 24 * 365.25),
            formFilled: prev_data.formFilled,
            questionnaire: 1,
            createdAt: prev_data.createdAt,
            lastUpdatedAt: new Date(),
        };

        // 3. Panggil API update
        return updateDataKaryawan(prev_data.nomorIndukKaryawan, updatedData);
    };

    const { mutate, isPending, isError, error, reset } = useMutation({
        mutationFn, 
        onError: (err: any) => {
            console.error('Error updating data: ', err);
        },
        onSuccess: () => {
            console.log('Data berhasil diupdate');
            // Kalau mau refresh cache juga bisa:
            queryClient.invalidateQueries({ queryKey: ['datakaryawan'] });
        },
        retry: 3,
        retryDelay: (attempt: any) => Math.min(1000 * 2 ** attempt, 30000),
    });

    // DATA DARI PAGINATION
    type questionnairesFE = { /* Data Exposed from DB (get per dept) */
        type: "form" | "assessment" | "question";
        IDForm : string;
        
        IDAssessment : string | null; /* DB : AT.ID_AT */
        
        IDQuestion : string | null; /* DB : Q.ID_Q */
        indexQ: number | null;
    }
    // UNTUK PAGINATION
    const flatQuestionnaireData = useMemo(() => {
            if (!dataQuestionnaires || questionnairesLoading || questionnairesError) return [];
        
            return dataQuestionnaires.reduce((acc: questionnairesFE[], form: any) => {
                acc.push({
                    type: "form",
                    IDForm : form.idForm,
            
                    IDAssessment: null, 
                    
                    IDQuestion : null,
                    indexQ: null,
                });
        
                form.AssessmentType.forEach((assessment: any) => {
                    acc.push({
                        type: "assessment",
                        IDForm : form.idForm,
                
                        IDAssessment : assessment.idAssessmentType, 
                        
                        IDQuestion : null,
                        indexQ: null,
                    });
            
                    assessment.Questions.forEach((question: any, index: number) => {
                        acc.push({
                            type: "question",
                            IDForm : form.idForm,
                    
                            IDAssessment : assessment.idAssessmentType, 
                            
                            IDQuestion : question.idQuestion,
                            indexQ: index+1,
                        });
                    });
                });
        
                return acc;
            }, []);
        }, [dataQuestionnaires, questionnairesLoading, questionnairesError]);
    const [ activePage, setActivePage] = useState<number>(0);   
    
    function changeAnswerValue(idForm: string, idAssessment: string, idQuestion: string, value: number){
        const updatedQuestionnaires = questionnaires.map((form) => {
            if (form.IDForm === idForm) {
                return {
                    ...form,
                    AssessmentType: form.AssessmentType.map((assessment) => {
                        if (assessment.IDAssessment === idAssessment) {
                            return {
                                ...assessment,
                                Ques: assessment.Ques.map((question) => {
                                    if (question.IDQue === idQuestion) {
                                        return { ...question, answer: value };
                                    }
                                    return question;
                                }),
                            };
                        }
                        return assessment;
                    }),
                };
            }
            return form;
        });
        setQuestionnaires(updatedQuestionnaires);
    }
    
    // MENAMPILKAN DATA DARI PAGINATION DAN AMBIL DATANYA DARI CONTEXT
    function hasUnansweredQuestion(questionnaires: contextHooks.questionnairesFE): boolean {
        return questionnaires.some((form) =>
            form.AssessmentType.some((assessment) =>
                assessment.Ques.some((question) => question.answer === null)
            )
        );
    }
    console.log(questionnaires);
    console.log("HABIS SINI");
    console.log(flatQuestionnaireData);

    const [ submitNotice, setSubmitNotice] = useState<{title: string, message: string, popup: boolean, color: "error"|"success"|""}>({title: "", message: "", popup: false, color: ""});
    const [ submitLoading, setSubmitLoading ] = useState<boolean>(false);

    
    
    async function submitAll(){
        setSubmitLoading(true);
        console.log("MSUK");
        if (hasUnansweredQuestion(questionnaires)) {
            console.log("MSUK hasunansweredques");

            setSubmitLoading(false);
            setSubmitNotice({title: "Jawaban tidak lengkap.", message: "Masih ada pertanyaan yang belum diisi, silahkan mengisi sebelum di-submit", popup: true, color: "error"});
            return;
        }
        console.log("Sudah terjawab semua");

    
        const response = questionnaires.map((form: any) => ({
            id_form: form.IDForm,
            nomorIndukKaryawan: dataKaryawan?.nomorIndukKaryawan,
        }));
    
        const response_result = await fetch('/api/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ responses: response }),
        })
        .then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                return {
                    error: true,
                    status: res.status,
                    message: data.error || 'Something went wrong',
                    details: data.message || data.details || ''
                };
            }
            return {
                error: false,
                status: res.status,
                data: data
            };
        });
    
        if (response_result.error) {
            setSubmitLoading(false);
            setSubmitNotice({title: response_result.message, message: response_result.details, popup: true, color: "error"});
            return;
        }

        const params = new URLSearchParams({
            nomorIndukKaryawan: dataKaryawan?.nomorIndukKaryawan 
        });        
        const responses = await fetch(`/api/responses?${params.toString()}`)
                                .then(res => res.ok ? res.json() : [])
                                .then(data => Array.isArray(data) ? data : [])
                                .catch(() => []);
    
        const answers = questionnaires.flatMap((form: any) => 
            form.AssessmentType.flatMap((assessment: any) => 
                assessment.Ques.map((question: any) => ({
                    idResp: responses.find((res: any) => res.id_form === form.IDForm)?.idResp,
                    idAssess: assessment.IDAssessment,
                    idQuestion: question.IDQue,
                    answer: question.answer,
                }))
            )
        );
    
        const answers_result = await fetch('/api/answers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ answers }),
        })
        .then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                return {
                    error: true,
                    status: res.status,
                    message: data.error || 'Something went wrong',
                    details: data.message || data.details || ''
                };
            }
            return {
                error: false,
                status: res.status,
                data: data
            };
        });
    
        if (answers_result.error) {
            setSubmitLoading(false);
            setSubmitNotice({title: answers_result.message, message: answers_result.details, popup: true, color: "error"}); 
            return;
        }
        const datakaryawanUpdate = await fetch(`/api/datakaryawan/${dataKaryawan?.nomorIndukKaryawan}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...dataKaryawan, questionnaire: 1}),
        })
        .then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                return {
                    error: true,
                    status: res.status,
                    message: data.error || 'Something went wrong',
                    details: data.message || data.details || ''
                };
            }
            return {
                error: false,
                status: res.status,
                data: data
            };
        });
        if (datakaryawanUpdate.error) {
            setSubmitLoading(false);
            setSubmitNotice({title: datakaryawanUpdate.message, message: datakaryawanUpdate.details, popup: true, color: "error"}); 
            return;
        }
        mutate();
        setSubmitLoading(false);
        setSubmitNotice({title: "Berhasil Submit", message: "Jawaban berhasil disimpan", popup: true, color: "success"});

        setQuestionnaires([]);
        router.push('/employee/dashboard');
    }
    

    return  (
        <>
            <div className={`flex flex-col max-h-[90%] overflow-y-hidden h-screen px-5 py-3 w-full`}>
                
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="secondary"
                            disabled={questionnairesLoading}
                            className={`flex h-[5%] w-full ring-2 ring-blue-500 ring-offset-2 ring-offset-white rounded-sm md:w-[50%] mb-4 
                                bg-white text-blue-500 hover:text-white hover:bg-blue-500 active:text-white active:bg-blue-500 
                                cursor-pointer items-center justify-center ${questionnairesLoading ? 'opacity-100 cursor-not-allowed' : ''}`}
                            >
                            {questionnairesLoading || karyawanLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                <div className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent border-solid rounded-full animate-spin" />
                                <p className="text-sm font-medium">Memuat data...</p>
                                </div>
                            ) : (
                                "Questions"
                            )}  
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        side="bottom"
                        align="center"
                        sideOffset={16}
                        className="max-h-[360px] md:max-h-[425px] max-w-fit overflow-y-auto"
                    >
                        <ScrollArea>
                            {
                            dataQuestionnaires?.map(
                                (form: any, indexF: number) => {
                                    return(
                                        <div className="flex flex-col grow w-full mb-4" key={form.idForm}>
                                            <h1 className="block w-full grow text-lg text-blue-500 bg-white border-b-2 border-blue-500 pb-1">
                                                {form.titleForm}
                                            </h1>
                                            {form.AssessmentType.map(
                                                (assessment: any, indexA: number)=>{
                                                    return(
                                                        <div className="flex flex-row flex-wrap gap-2 grow w-full border-b-2 border-blue-500 mb-2 pb-1" key={assessment.idAssessmentType}>
                                                            <h2 className="block w-[100%]">
                                                                {assessment.titleAT} <span className="text-sm italic">{assessment.typeAT}</span>  
                                                            </h2>
                                                            {assessment.Questions.map(
                                                                (question: any, indexQ: any)=>{
                                                                    return(
                                                                        <Button 
                                                                            variant="outline" 
                                                                            size="icon" 
                                                                            key={question.idQuestion} 
                                                                            onClick={
                                                                            () => {
                                                                                const pageIndex = flatQuestionnaireData.findIndex(
                                                                                    (item: any) =>
                                                                                        item.IDForm === form.idForm &&
                                                                                        item.IDAssessment === assessment.idAssessmentType &&
                                                                                        item.IDQuestion === question.idQuestion
                                                                                );
                                                                                if (pageIndex !== -1) {
                                                                                    setActivePage(pageIndex);
                                                                                }
                                                                            }}
                                                                            className={`
                                                                                ${
                                                                                    questionnaires.find(
                                                                                        (item: any) =>
                                                                                            item.IDForm === form.idForm 
                                                                                    )?.AssessmentType.find((assess:any)=>assess.IDAssessment === assessment.idAssessmentType)?.Ques.find((q:any)=>q.IDQue === question.idQuestion)?.answer === null
                                                                                        ? "bg-red-500 text-white shadow-inner border-white-400"
                                                                                        : "bg-white text-blue-500 border-blue-500 opacity-[0.7] hover:opacity-[1] hover:bg-blue-400 hover:text-white"
                                                                                }
                                                                            `}
                                                                        >
                                                                            {indexQ+1}
                                                                        </Button>
                                                                    )
                                                                }
                                                            )}
                                                        </div>
                                                    )
                                                }
                                            )}
                                        </div>
                                    )   
                                }
                            )}
                        </ScrollArea>
                    </PopoverContent>
                </Popover>

                <div className="flex flex-col grow w-full overflow-y-hidden ring-2 ring-blue-500 ring-offset-2 ring-offset-white rounded-sm">
                    <div className="flex flex-col h-[95%] max-h-[95%] overflow-y-auto">
                        {flatQuestionnaireData[activePage]?.type === "form" && (
                            <div className="h-[100%]">
                                <div className="h-[15%] align-middle ">
                                    <h1 className="text-blue-500 text-extrabold text-xl text-center">
                                    {
                                        questionnaires.find(
                                        (e) => e.IDForm === flatQuestionnaireData[activePage].IDForm
                                        )?.TitleForm
                                    }
                                    </h1>
                                </div>
                                <div className="h-[85%] overflow-y-auto">
                                    <p className="text-sm whitespace-pre-line overflow-y-auto">
                                    {
                                        questionnaires.find(
                                        (e) => e.IDForm === flatQuestionnaireData[activePage].IDForm
                                        )?.DescForm
                                    }
                                    </p>
                                </div>
                            </div>
                        )}

                        {flatQuestionnaireData[activePage]?.type === "assessment" && (
                            <div className="h-[100%]">
                                <div className="h-[5%] border-b">
                                    <p className="text-[10px] text-extralight text-start">
                                    {
                                        questionnaires.find(
                                        (e) => e.IDForm === flatQuestionnaireData[activePage].IDForm
                                        )?.TitleForm
                                    }
                                    </p>
                                </div>

                                <div className="max-h-[95%] overflow-y-auto">
                                    <h1 className="h-[15%] text-center text-xl text-blue-500 text-bold">
                                    {
                                        questionnaires
                                        .find(
                                            (e) =>
                                            e.IDForm === flatQuestionnaireData[activePage].IDForm
                                        )
                                        ?.AssessmentType.find(
                                            (e) =>
                                            e.IDAssessment ===
                                            flatQuestionnaireData[activePage].IDAssessment
                                        )?.TitleAssessment
                                    }
                                    </h1>
                                    <p className="h[85%] p-1 text-sm whitespace-pre-line overflow-y-auto">
                                    {
                                        questionnaires
                                        .find(
                                            (e) =>
                                            e.IDForm === flatQuestionnaireData[activePage].IDForm
                                        )
                                        ?.AssessmentType.find(
                                            (e) =>
                                            e.IDAssessment ===
                                            flatQuestionnaireData[activePage].IDAssessment
                                        )?.DescAssessment
                                    }
                                    </p>
                                </div>
                            </div>
                        )}

                        {flatQuestionnaireData[activePage]?.type === "question" && (
                            <div className="h-[100%]">
                                <div className="h-[5%] border-b">
                                    <p className="text-[8px] text-extralight text-start">
                                    {
                                        questionnaires.find(
                                        (e) => e.IDForm === flatQuestionnaireData[activePage].IDForm
                                        )?.TitleForm
                                    }
                                    {" - "}
                                    {
                                        questionnaires
                                        .find(
                                            (e) =>
                                            e.IDForm === flatQuestionnaireData[activePage].IDForm
                                        )
                                        ?.AssessmentType.find(
                                            (e) =>
                                            e.IDAssessment ===
                                            flatQuestionnaireData[activePage].IDAssessment
                                        )?.TitleAssessment
                                    }
                                    </p>
                                </div>

                                <div className="max-h-[95%] overflow-y-auto">
                                    <p className="h-[10%] text-start text-sm text-blue-500 p-1">
                                    {
                                        questionnaires
                                        .find(
                                            (e) =>
                                            e.IDForm === flatQuestionnaireData[activePage].IDForm
                                        )
                                        ?.AssessmentType.find(
                                            (e) =>
                                            e.IDAssessment ===
                                            flatQuestionnaireData[activePage].IDAssessment
                                        )?.TitleAssessment
                                    }
                                    {
                                        " pertanyaan ke - " + flatQuestionnaireData[activePage].indexQ
                                    }
                                    </p>
                                    <p className="h[10%] p-1 text-center text-lg whitespace-pre-line">
                                    {
                                        questionnaires
                                        .find(
                                            (e) =>
                                            e.IDForm === flatQuestionnaireData[activePage].IDForm
                                        )
                                        ?.AssessmentType.find(
                                            (e) =>
                                            e.IDAssessment ===
                                            flatQuestionnaireData[activePage].IDAssessment
                                        )?.Ques.find((q)=>q.IDQue === flatQuestionnaireData[activePage].IDQuestion)?.TitleQue
                                    }
                                    </p>
                                    <p className="h[10%] p-1 text-start text-sm whitespace-pre-line">
                                    {
                                        questionnaires
                                        .find(
                                            (e) =>
                                            e.IDForm === flatQuestionnaireData[activePage].IDForm
                                        )
                                        ?.AssessmentType.find(
                                            (e) =>
                                            e.IDAssessment ===
                                            flatQuestionnaireData[activePage].IDAssessment
                                        )?.Ques.find((q)=>q.IDQue === flatQuestionnaireData[activePage].IDQuestion)?.DescQue
                                    }
                                    </p>
                                    <div>
                                        <div className="flex justify-around">
                                            <button onClick={()=>changeAnswerValue(
                                                flatQuestionnaireData[activePage].IDForm,
                                                flatQuestionnaireData[activePage].IDAssessment,
                                                flatQuestionnaireData[activePage].IDQuestion,
                                                1
                                            )} className={`border text-md font-semibold px-4 rounded-md w-[15%] h-[30px] shadow-md active:bg-blue-500
                                                ${questionnaires
                                                    .find(
                                                        (e) =>
                                                        e.IDForm === flatQuestionnaireData[activePage].IDForm
                                                    )
                                                    ?.AssessmentType.find(
                                                        (e) =>
                                                        e.IDAssessment ===
                                                        flatQuestionnaireData[activePage].IDAssessment
                                                    )?.Ques.find((q)=>q.IDQue === flatQuestionnaireData[activePage].IDQuestion)?.answer === 1 ? "bg-blue-600 text-white shadow-inner border-white-400" : "bg-blue-50 border-blue-500 text-blue-500 opacity-[0.7] hover:opacity-[1] hover:bg-blue-400 hover:text-white"}
                                            `}>1</button>   

                                            <button onClick={()=>changeAnswerValue(
                                                flatQuestionnaireData[activePage].IDForm,
                                                flatQuestionnaireData[activePage].IDAssessment,
                                                flatQuestionnaireData[activePage].IDQuestion,
                                                2
                                            )} className={`border text-md font-semibold px-4 rounded-md w-[15%] h-[30px] shadow-md active:bg-blue-500
                                                ${questionnaires
                                                    .find(
                                                        (e) =>
                                                        e.IDForm === flatQuestionnaireData[activePage].IDForm
                                                    )
                                                    ?.AssessmentType.find(
                                                        (e) =>
                                                        e.IDAssessment ===
                                                        flatQuestionnaireData[activePage].IDAssessment
                                                    )?.Ques.find((q)=>q.IDQue === flatQuestionnaireData[activePage].IDQuestion)?.answer === 2 ? "bg-blue-600 text-white shadow-inner border-white-400" : "bg-blue-50 border-blue-500 text-blue-500 opacity-[0.7] hover:opacity-[1] hover:bg-blue-400 hover:text-white"}
                                            `}>2</button>

                                            <button onClick={()=>changeAnswerValue(
                                                flatQuestionnaireData[activePage].IDForm,
                                                flatQuestionnaireData[activePage].IDAssessment,
                                                flatQuestionnaireData[activePage].IDQuestion,
                                                3
                                            )} className={`border text-md font-semibold px-4 rounded-md w-[15%] h-[30px] shadow-md active:bg-blue-500
                                                ${questionnaires
                                                    .find(
                                                        (e) =>
                                                        e.IDForm === flatQuestionnaireData[activePage].IDForm
                                                    )
                                                    ?.AssessmentType.find(
                                                        (e) =>
                                                        e.IDAssessment ===
                                                        flatQuestionnaireData[activePage].IDAssessment
                                                    )?.Ques.find((q)=>q.IDQue === flatQuestionnaireData[activePage].IDQuestion)?.answer === 3 ? "bg-blue-600 text-white shadow-inner border-white-400" : "bg-blue-50 border-blue-500 text-blue-500 opacity-[0.7] hover:opacity-[1] hover:bg-blue-400 hover:text-white"}
                                            `}>3</button>   
                                            <button onClick={()=>changeAnswerValue(
                                                flatQuestionnaireData[activePage].IDForm,
                                                flatQuestionnaireData[activePage].IDAssessment,
                                                flatQuestionnaireData[activePage].IDQuestion,
                                                4
                                            )} className={`border text-md font-semibold px-4 rounded-md w-[15%] h-[30px] shadow-md active:bg-blue-500
                                                ${questionnaires
                                                    .find(
                                                        (e) =>
                                                        e.IDForm === flatQuestionnaireData[activePage].IDForm
                                                    )
                                                    ?.AssessmentType.find(
                                                        (e) =>
                                                        e.IDAssessment ===
                                                        flatQuestionnaireData[activePage].IDAssessment
                                                    )?.Ques.find((q)=>q.IDQue === flatQuestionnaireData[activePage].IDQuestion)?.answer === 4 ? "bg-blue-600 text-white shadow-inner border-white-400" : "bg-blue-50 border-blue-500 text-blue-500 opacity-[0.7] hover:opacity-[1] hover:bg-blue-400 hover:text-white"}
                                            `}>4</button>

                                            <button onClick={()=>changeAnswerValue(
                                                flatQuestionnaireData[activePage].IDForm,
                                                flatQuestionnaireData[activePage].IDAssessment,
                                                flatQuestionnaireData[activePage].IDQuestion,
                                                5
                                            )} className={`border text-md font-semibold px-4 rounded-md w-[15%] h-[30px] shadow-md active:bg-blue-500
                                                ${questionnaires
                                                    .find(
                                                        (e) =>
                                                        e.IDForm === flatQuestionnaireData[activePage].IDForm
                                                    )
                                                    ?.AssessmentType.find(
                                                        (e) =>
                                                        e.IDAssessment ===
                                                        flatQuestionnaireData[activePage].IDAssessment
                                                    )?.Ques.find((q)=>q.IDQue === flatQuestionnaireData[activePage].IDQuestion)?.answer === 5 ? "bg-blue-600 text-white shadow-inner border-white-400" : "bg-blue-50 border-blue-500 text-blue-500 opacity-[0.7] hover:opacity-[1] hover:bg-blue-400 hover:text-white"}
                                            `}>5</button>                                      
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )
                    }
                    </div>
                    <div className="flex flex-row h-[10%] justify-end items-end ">
                        <div className="flex grow flex-row gap-1 pt-1 justify-end ">
                            <button className={`block px-1 py-1 rounded-md h-[40px] border border-zinc-500 hover:border-zinc-900 hover:border-2 active:font-bold disabled:opacity-40`} 
                                onClick={()=>setActivePage(activePage-1)} 
                                disabled={activePage===0}>
                                <svg width="40px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
                                    <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 10H2m0 0l7-7m-7 7l7 7"/>
                                </svg>
                            </button>
                            {activePage+1 !== flatQuestionnaireData.length && (<button className={`block grow px-1 py-1 rounded-md h-[40px] md:grow-0 border border-zinc-500 hover:border-zinc-900 hover:border-2 active:font-bold disabled:opacity-40`} onClick={()=>setActivePage(activePage+1)} >
                                <svg width="40px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none" className="hidden md:block">
                                    <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 10h16m0 0l-7-7m7 7l-7 7"/>
                                </svg>
                                <span className="md:hidden active:font-extrabold">Continue</span>
                            </button>)}
                            {activePage+1 === flatQuestionnaireData.length && (
                                <button className={`block grow px-1 py-1 rounded-md h-[40px] w-full border border-zinc-500 hover:border-zinc-900 hover:border-2 hover:font-extrabold disabled:opacity-40 disabled:bg-red-300`} 
                                    onClick={(e)=>{
                                        e.currentTarget.blur();
                                        submitAll();}}
                                >
                                    <span className="hover:font-extrabold">Submit</span>
                                </button>
                            )}
                        </div>
                    </div>
                    <AlertDialog open={submitLoading} onOpenChange={setSubmitLoading}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle className="font-extrabold text-xl">Mengupload Data</AlertDialogTitle>
                            <AlertDialogDescription className="text-sm">
                                Data sedang di-upload. Mohon tunggu sebentar.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog open={submitNotice.popup} onOpenChange={(val) => setSubmitNotice(prev => ({...prev, popup: val}))}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle className="font-extrabold text-xl">{submitNotice.title}</AlertDialogTitle>
                            <AlertDialogDescription className="text-sm">
                                {submitNotice.message}
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    Tutup
                                </AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </>
    )
}