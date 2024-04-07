import React from 'react';
import VideoEmbed from "@/components/VideoEmbed/VideoEmbed";
import Link from "next/link";
import {anilibria} from "@/api/anilibria/anilibria";
import Comments from "@/components/Comments/Comments";
import {useQuery} from "@tanstack/react-query";

interface ResponseProps {
    names: {
        ru: string;
    }
    player: {
        host: string;
        list: {
            episode: string;
            hls: {
                fhd?: string;
                hd?: string;
                sd?: string;
            }
        }[]
    },
}

export default async function Page({ params }: { params: { code: string } }) {
    const { isFetching, data } = useQuery({
        queryKey: ['anime', params.code],
        queryFn: async () => fetchAnime(params.code),
    });

    async function fetchAnime(code: string) {
        const response: ResponseProps = await anilibria.title.code(code)
        return response
    }

    if (!data) {
        return (
            <>Ничего не найдено</>
        )
    }

    const animePlayer = data.player;

    // Некоторые аниме тайтлы не имеют плеера
    if (Object.keys(animePlayer.list).length === 0) {
        return (
            <>
                <div>{params.code}</div>
                <div>К сожалению, онлайн-плеер для данного аниме недоступен.</div>
            </>
        );
    }

    return (
        <>
            <Link href="/titles">Вернуться</Link>
            <div>{params.code}</div>
            <VideoEmbed
              title={data.names.ru}
              player={animePlayer}
              preview="https://anilibria.tv/storage/releases/episodes/previews/9542/1/DMzcnlKyg89dRv5f__86bf22cbc0faac3d42cc7b87ea8c712f.jpg"
            />
            <Comments titleCode={params.code} />
        </>
    );
}