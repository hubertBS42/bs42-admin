'use client'
import { Loader, Panel, Text, VStack } from 'rsuite'
import Comment from '../Comment/Comment'
import { useEffect, useState } from 'react'
import { fetcher, formatComments } from '@/utils/functions'
import { toast } from 'react-toastify'

import { useSession } from 'next-auth/react'

import CommentPostField from '../CommentPostField/CommentPostField'

const Comments = ({ typeRef }) => {
	const session = useSession()

	const user = session?.data?.user

	const [isLoading, setIsLoading] = useState(false)
	const [comments, setComments] = useState([])
	const [openedCommentField, setOpenedCommentField] = useState('')
	const [count, setCount] = useState(0)

	const loadComments = async () => {
		setIsLoading(true)

		const {
			status,
			message,
			data: { comments, count },
		} = await fetcher(`/api/comments?typeRef=${typeRef}`)

		setIsLoading(false)

		if (status === 'error')
			return toast.error('Failed to load comments.')

		setComments(formatComments(comments))
		setCount(count)
	}

	const addComment = async data => {
		const {
			status,
			message,
			data: comment,
		} = await fetcher('/api/comments/add', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		})

		if (status === 'error') return toast.error('Failed add comment.')

		loadComments()
	}

	const updateComment = async (comment, data) => {
		const { status, message } = await fetcher(
			`/api/comments/${comment.id}`,
			{
				method: 'PATCH',
				body: JSON.stringify(data),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
			}
		)

		if (status === 'error') return toast.error('Failed update comment.')

		loadComments()
	}

	useEffect(() => {
		loadComments()
	}, [])

	return (
		<Panel header={<span>Comments ({count})</span>}>
			<CommentPostField
				user={user}
				typeRef={typeRef}
				addComment={addComment}
			/>

			<VStack
				alignItems='stretch'
				style={{ position: 'relative', minHeight: 400 }}
				spacing={0}
			>
				{!user ||
					(isLoading && <Loader backdrop content='loading...' vertical />)}
				{comments.length > 0 ? (
					comments.map(comment => (
						<Comment
							key={comment.id}
							comment={comment}
							user={user}
							updateComment={updateComment}
							addComment={addComment}
							openedCommentField={openedCommentField}
							setOpenedCommentField={setOpenedCommentField}
						/>
					))
				) : (
					<VStack
						alignItems='center'
						justifyContent='center'
						style={{ minHeight: 400 }}
					>
						<Text muted size='md'>
							No comments posted.
						</Text>
					</VStack>
				)}
			</VStack>
		</Panel>
	)
}
export default Comments
