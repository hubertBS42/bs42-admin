'use client'
import { format, formatDistance, subDays } from 'date-fns'
import { Button, HStack, Panel, Text, VStack } from 'rsuite'

const Comment = ({
	comment,
	user,
	handleOpen,
	setComment,
	level = 0,
}) => {
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
									handleOpen('reply')
									setComment(comment)
								}}
								style={{ padding: 0 }}
							>
								Reply
							</Button>
							{comment.user._id === user?.id && (
								<Button
									appearance='link'
									onClick={() => {
										handleOpen('edit')
										setComment(comment)
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
						// className={classes.bodySection}
					/>
					{/* <p>{comment.body}</p> */}
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
			</Panel>
			{/* {comment.replies && comment.replies.length > 0 && (
				<div>
					{comment.replies.map(reply => (
						<Comment
							key={reply.id}
							comment={reply}
							level={2}
							user={user}
							handleOpen={handleOpen}
							setComment={setComment}
						/>
					))}
				</div>
			)} */}
		</div>
	)
}
export default Comment
