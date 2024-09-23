'use client'
import { format, formatDistance, subDays } from 'date-fns'
import { Button, HStack, Panel, Text, VStack } from 'rsuite'
import CommentPostField from '../CommentPostField/CommentPostField'
import { useState } from 'react'

const Comment = ({
	comment,
	user,
	updateComment,
	addComment,
	openedCommentField,
	setOpenedCommentField,
	level = 0,
}) => {
	const [commentMode, setCommentMode] = useState('')
	return (
		<div className='comment' style={{ marginLeft: level * 20 + 'px' }}>
			<Panel bordered>
				<VStack alignItems='stretch' spacing={10}>
					<HStack justifyContent='space-between'>
						<strong>
							{comment.user?.firstName} {comment.user?.lastName}
						</strong>

						<HStack>
							<Button
								appearance='link'
								onClick={() => {
									setOpenedCommentField(comment.id)
									setCommentMode('reply')
								}}
								style={{ padding: 0 }}
							>
								Reply
							</Button>
							{comment.user._id === user?.id && (
								<Button
									appearance='link'
									onClick={() => {
										setOpenedCommentField(comment.id)
										setCommentMode('edit')
									}}
									style={{ padding: 0 }}
								>
									Edit
								</Button>
							)}
						</HStack>
					</HStack>
					<div
						dangerouslySetInnerHTML={{ __html: comment.body }}
						style={{ width: '100%', maxWidth: '82vw' }}
					/>
					<HStack justifyContent='space-between'>
						<Text muted>
							Posted on: {format(comment.createdAt, 'dd-MM-yyyy')}
						</Text>

						{comment.createdAt !== comment.updatedAt && (
							<Text muted>
								Updated{' '}
								{formatDistance(comment.updatedAt, new Date(), {
									addSuffix: true,
								})}
							</Text>
						)}
					</HStack>
				</VStack>
				{openedCommentField === comment.id && (
					<div style={{ marginTop: '1em' }}>
						<CommentPostField
							user={user}
							comment={comment}
							commentMode={commentMode}
							updateComment={updateComment}
							addComment={addComment}
							parent={commentMode === 'edit' ? comment.parent : comment.id}
							setOpenedCommentField={setOpenedCommentField}
						/>
					</div>
				)}
			</Panel>
			{comment.replies && comment.replies.length > 0 && (
				<div>
					{comment.replies.map(reply => (
						<Comment
							key={reply.id}
							comment={reply}
							user={user}
							updateComment={updateComment}
							addComment={addComment}
							openedCommentField={openedCommentField}
							setOpenedCommentField={setOpenedCommentField}
							level={2}
						/>
					))}
				</div>
			)}
		</div>
	)
}
export default Comment
