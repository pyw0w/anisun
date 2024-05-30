import classes from "@/components/Recommendations/Recommendations.module.css";
import RecommendationsShareButton
    from "@/components/Recommendations/RecommendationsShareButton/RecommendationsShareButton";
import {AspectRatio, Badge, Container, Group, Image, Stack, Text} from "@mantine/core";
import {variables} from "@/configs/variables";
import NextImage from "next/image";
import {formatAiredOnDate} from "@/utils/Misc/formatAiredOnDate";
import {AnimeType} from "@/types/Shikimori/Responses/Types/Anime.type";

export default function RecommendationsNewAnimeData({
    anime,
    redirectUser,
    translatedKind,
    translatedStatus
}: {
    anime: AnimeType;
    redirectUser: () => void;
    translatedKind: string;
    translatedStatus: string;
}) {
    return (
        <div className={classes.recommendationWrapper}>
            <RecommendationsShareButton url={anime?.url.replace('https://shikimori.one/animes/', '')}/>
            <Group
                onClick={redirectUser}
                className={classes.group}
                align="flex-start"
            >
                <AspectRatio className={classes.aspectRatio} ratio={16 / 9}>
                    <Container fluid className={classes.container}>
                        <Image
                            alt="Anime preview"
                            src={anime?.poster?.originalUrl}
                            placeholder="blur"
                            blurDataURL={variables.imagePlaceholder}
                            fill
                            component={NextImage}
                            radius="md"
                        />
                        <div className={classes.scoreBadgeWrapper}>
                            <Badge
                                size="xs"
                                autoContrast
                                color="black"
                                className={classes.scoreBadge}
                            >
                                {anime.score}
                            </Badge>
                        </div>
                        <div className={classes.episodesBadgeWrapper}>
                            <Badge
                                size="xs"
                                autoContrast
                                color="black"
                                className={classes.episodesBadge}
                            >
                                {anime.episodesAired} / {anime.episodes}
                            </Badge>
                        </div>
                    </Container>
                </AspectRatio>
                <Stack className={classes.stack} h="100%" justify="flex-start">
                    <Text className={classes.title} lineClamp={2}>
                        {anime?.russian ?? anime.name}
                        {anime?.russian && ` - ${anime.name}`}
                    </Text>
                    <Text className={classes.text} lineClamp={1}>
                        {`${translatedKind}, ${translatedStatus}`}
                    </Text>
                    <Text className={classes.text} lineClamp={1}>
                        {formatAiredOnDate(anime.airedOn?.date ?? '')}
                    </Text>
                </Stack>
            </Group>
        </div>
    );
}