"use client";

import {useQuery} from "@tanstack/react-query";
import {account} from "@/lib/account/account";
import {Avatar, Flex, Image, rem, Skeleton, Stack, Text, Title, Tooltip} from "@mantine/core";
import React from "react";
import {UserResource} from "@clerk/types";
import dayjs from "dayjs";
import 'dayjs/locale/ru';
import Link from "next/link";
import classes from './Account.module.css';

export default function Account({ user }: { user: UserResource }) {
    dayjs.locale('ru');
    const getAccountStats = async () => {
        const accountReputation = await account.reputation({ userid: user.id });
        const accountTotalComments = await account.totalComments({ userid: user.id });

        return { reputation: accountReputation.data, totalComments: accountTotalComments.data };
    };

    const { isPending, data } = useQuery({
        queryKey: ['accountStats', user.id],
        queryFn: getAccountStats,
    });

    const tooltipAvatarInfo = (
        <Flex
            align="center"
            direction="column"
            className={classes.tooltipMenu}
        >
            <Image
                radius="md"
                src={user.imageUrl}
                w={384}
                h={384}
                alt={`Аватар пользователя ${user.username ?? 'unknown username'}`}
            />
            <Stack className={classes.tooltipInfo} align="center" gap={0}>
                <Title order={2}>{user.username ?? 'unknown username'}</Title>
            </Stack>
        </Flex>
    );

    return (
        <Flex gap={rem(16)}>
            <Tooltip
                radius="md"
                color="black"
                openDelay={500}
                label={tooltipAvatarInfo}
                position="top-start"
            >
                <Avatar
                    src={user.imageUrl ?? '/blurred.png'}
                    alt={user.username ?? 'unknown username'}
                    size={112}
                    component={Link}
                    href={user.imageUrl}
                    target="_blank"
                >
                    {
                        user.username
                            ? user.username[0]
                            : '?'
                    }
                </Avatar>
            </Tooltip>
            <Stack gap={0}>
                <Text fw={500} size={rem(36)}>{user.username}</Text>
                <Text>
                    Дата создания аккаунта: {
                    dayjs(user.createdAt).format('D MMMM YYYY в H:mm')
                }
                </Text>
                <Stack gap={rem(4)}>
                    <Skeleton visible={isPending} width={256} height={24}>
                        <Text>Репутация: {data?.reputation}</Text>
                    </Skeleton>

                    <Skeleton visible={isPending} width={256} height={24}>
                        <Text>Комментариев: {data?.totalComments}</Text>
                    </Skeleton>
                </Stack>
            </Stack>
        </Flex>
    );
}