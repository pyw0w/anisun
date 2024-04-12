import {useQuery} from "@tanstack/react-query";
import {comments} from "@/lib/comments/comments";
import {CommentType} from "@/types/CommentType";
import {Comment} from "@/components/Comments/Comment/Comment";

export function ChildCommentList({ uuid }: { uuid: string }) {
    const {
        data,
        error,
        status
        // @ts-ignore
    } = useQuery({
        queryKey: ["comments", uuid],
        queryFn: retrieveChildComments,
        refetchInterval: 60000,
    })

    async function retrieveChildComments() {
        return await comments.getChildren({ uuid: uuid })
    }

    const commentGroup: CommentType[] | null = data?.data ?? []

    const childCommentSection = status === 'pending' ? (
        <>Loading...</>
    ) : status === 'error' ? (
        <>Error: {error.message}</>
    ) : (
        commentGroup.map((comment) => {
            return (
                <Comment key={comment.uuid} comment={comment} />
            )
        })
    )

    return (
        <div>
            {childCommentSection}
        </div>
    )
}