"use client"

import {comments} from "@/lib/comments/comments";
import AddComment from "@/components/Comments/AddComment";
import {useInfiniteQuery} from "@tanstack/react-query";
import Comment from "@/components/Comments/Comment";
import {InView} from "react-intersection-observer";
import {Loader} from "@mantine/core";
import React from "react";
import classes from './Comments.module.css';
import {SignedIn, SignedOut, UserButton, useUser} from "@clerk/nextjs";
import Link from "next/link";
import {nanoid} from "nanoid";
import {CommentType} from "@/types/commentType";

function arrangeHierarchyComments(comment: CommentType, otherChildren?: CommentType[]) {
    if (!comment.children) {
        if (!otherChildren) {
            return
        }

        const filteredOtherChildren = otherChildren.filter((currentComment) => {
            return currentComment.parentuuid === comment.uuid
        })

        return filteredOtherChildren.map((filteredChild) => {
            return (
                <div key={filteredChild.uuid}>
                    <Comment comment={filteredChild}/>
                    <div className={classes.childComments}>
                        {arrangeHierarchyComments(filteredChild, otherChildren)}
                    </div>
                </div>
            )
        })
    }

    const children = comment.children ?? []

    if (children?.length === 0) {
        return
    }

    const filteredChildren = children.filter((currentComment) => {
        // @ts-ignore
        return currentComment.parentuuid === comment.uuid
    })

    return filteredChildren.map((filteredChild) => {
        return (
            // @ts-ignore
            <div key={filteredChild.uuid}>
                {/* @ts-ignore */}
                <Comment comment={filteredChild} />
                <div className={classes.childComments}>
                    {// @ts-ignore
                        arrangeHierarchyComments(filteredChild, children)}
                </div>
            </div>
        )
    })
}

export default function Comments({ titleCode }: { titleCode: string }) {
    const getComments = async ({ pageParam } : { pageParam: number }) => {
        return await comments.get({title: titleCode, nextCursor: pageParam})
    }

    const { isLoaded } = useUser();

    const {
        data,
        error,
        fetchNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["comments", titleCode],
        // @ts-ignore
        queryFn: getComments,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage ? lastPage.nextCursor : [],
        refetchInterval: 60000,
    })

    const commentsSection = status === 'pending' ? (
        <Loader size="1rem" />
    ) : status === 'error' ? (
        <p>Error: {error.message}</p>
    ) : (
        <>
            {
                data.pages.map((group) => {
                    // @ts-ignore
                    const commentsGroup: CommentType[] | null = group.data ?? []

                    // @ts-ignore
                    return commentsGroup.map((comment) => {
                        return (
                            <div key={comment.uuid}>
                                <Comment comment={comment}/>
                                <div className={classes.childComments}>
                                    {arrangeHierarchyComments(comment)}
                                </div>
                            </div>
                        )
                    })
                })
            }
            <span>{isFetchingNextPage ? <Loader /> : 'Больше комментариев нет!'}</span>
        </>
    )

    return (
        <div>
            <SignedIn>
                <UserButton />
            </SignedIn>
            <SignedOut>
                <Link href="/sign-in">Войти в аккаунт</Link>
            </SignedOut>
            <AddComment titleCode={titleCode} parentUUID={null} branch={nanoid()} />
            {isLoaded && commentsSection}
            <InView onChange={(inView) => {
                if (!inView) {
                    return
                }

                const dataPages = data?.pages ?? []
                const lastDataPage = dataPages[dataPages.length - 1] ?? []
                const hasNextPageData = lastDataPage.data

                if (!hasNextPageData) {
                    return
                }

                fetchNextPage().then()
            }}>
                <hr></hr>
            </InView>
        </div>
    )
}