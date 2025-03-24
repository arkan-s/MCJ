import Image from 'next/image';

export function Logo({img, alt}:{img:string, alt:string}){
    return (
        <div className='w-[100px] h-[50px]'>
            <Image
                src={img}
                alt="Picture of the author"
                sizes="100vw"
                style={{
                    width: '100%',
                    height: 'auto',
                }}
                width={100}
                height={50}
            />
        </div>
    )
}

