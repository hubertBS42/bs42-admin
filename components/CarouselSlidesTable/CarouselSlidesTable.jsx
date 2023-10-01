'use client'
import { setDrawerOpen } from '@/redux/features/drawer/drawerSlice'
import { useDispatch } from 'react-redux'
import { Button, IconButton, Panel, Stack, Table } from 'rsuite'
import TrashIcon from '@rsuite/icons/Trash'
import EditIcon from '@rsuite/icons/Edit'
import PlusIcon from '@rsuite/icons/Plus'
import Status from '../Status/Status'

const CarouselSlidesTable = ({ data, deleteSlide }) => {
	const { Column, HeaderCell, Cell } = Table
	const { carouselSlides: slides } = data

	const dispatch = useDispatch()

	return (
		<Panel
			header={
				<Stack justifyContent='space-between'>
					<span>Carousel Slides</span>
					<Stack spacing={10}>
						<IconButton
							icon={<PlusIcon />}
							circle
							size='sm'
							appearance='primary'
							onClick={() => dispatch(setDrawerOpen({ mode: 'add' }))}
						/>
					</Stack>
				</Stack>
			}
			bordered
			bodyFill
		>
			<Table height={300} data={slides} wordWrap='break-word'>
				<Column flexGrow={1} fixed verticalAlign='middle'>
					<HeaderCell>Title</HeaderCell>
					<Cell dataKey='title' />
				</Column>

				<Column flexGrow={3} fixed verticalAlign='middle'>
					<HeaderCell>Description</HeaderCell>
					<Cell dataKey='description' />
				</Column>

				<Column flexGrow={1} verticalAlign='middle'>
					<HeaderCell>Status</HeaderCell>
					<Cell dataKey='isActive'>
						{rowData => <Status active={rowData.isActive} />}
					</Cell>
				</Column>

				<Column flexGrow={1} align='center' verticalAlign='middle'>
					<HeaderCell>...</HeaderCell>

					<Cell style={{ padding: '6px' }}>
						{rowData => (
							<>
								<Button
									appearance='link'
									onClick={() =>
										dispatch(setDrawerOpen({ mode: 'edit', data: rowData }))
									}
									style={{ padding: 0, marginRight: '.7em' }}
								>
									<EditIcon />
								</Button>
								<Button
									appearance='link'
									color='red'
									onClick={() => deleteSlide(rowData)}
									style={{ padding: 0 }}
								>
									<TrashIcon />
								</Button>
							</>
						)}
					</Cell>
				</Column>
			</Table>
		</Panel>
	)
}
export default CarouselSlidesTable
