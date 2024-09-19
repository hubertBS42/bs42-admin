import Image from 'next/image'
import {
	Button,
	HStack,
	Panel,
	PanelGroup,
	Stack,
	VStack,
} from 'rsuite'

import AdminIcon from '@rsuite/icons/Admin'
import EmailIcon from '@rsuite/icons/Email'
import PhoneIcon from '@rsuite/icons/Phone'
import LocationIcon from '@rsuite/icons/Location'

const SupplierCard = ({
	supplier,
	setSupplier,
	isLoading,
	newOrder = false,
}) => {
	return (
		<PanelGroup bordered>
			<Panel
				header={
					<Stack justifyContent='space-between'>
						<span>Supplier</span>

						{newOrder && (
							<Button
								appearance='link'
								size='sm'
								style={{ padding: 0 }}
								onClick={() => setSupplier(null)}
								disabled={isLoading}
							>
								Discard
							</Button>
						)}
					</Stack>
				}
			>
				<Stack spacing={17} style={{ fontSize: 15 }}>
					<div
						style={{
							position: 'relative',
							height: 80,
							width: 80,
							objectFit: 'cover',
							borderRadius: '50%',
							overflow: 'hidden',
						}}
					>
						<Image
							src={supplier?.logo?.url || '/images/profile.png'}
							alt={supplier?.name}
							fill
							sizes='(max-width: 768px) 80px, (max-width: 1200px) 80px, 80px'
						/>
					</div>
					<Stack direction='column' alignItems='flex-start'>
						<a
							target='_blank'
							style={{ color: '#6CD6FF' }}
							href={supplier?.website?.company || ''}
						>
							{supplier.name}
						</a>
						<span style={{ color: '#D4D4D4', fontSize: 13 }}>
							{supplier?.contact?.email}
						</span>
						<span style={{ color: '#D4D4D4', fontSize: 13 }}>
							{supplier?.contact?.primaryPhone}
						</span>
					</Stack>
				</Stack>
			</Panel>

			<Panel header='Contact'>
				<Stack
					direction='column'
					alignItems='flex-start'
					spacing={5}
					style={{ color: '#D4D4D4', fontSize: 13 }}
				>
					<HStack spacing={6} alignItems='center'>
						<AdminIcon />
						<HStack spacing={3}>
							<span>{supplier?.contact?.firstName}</span>
							<span>{supplier?.contact?.lastName}</span>
						</HStack>
					</HStack>
					<HStack>
						<EmailIcon />
						<span>{supplier?.contact?.email}</span>
					</HStack>
					<HStack>
						<PhoneIcon />
						<span>{supplier?.contact?.primaryPhone}</span>
					</HStack>
				</Stack>
			</Panel>

			<Panel header='Address'>
				<HStack alignItems='flex-start'>
					<LocationIcon />
					<VStack style={{ color: '#D4D4D4', fontSize: 13 }} spacing={0}>
						<span>{supplier?.address?.line1}</span>
						<span>{supplier?.address?.line2}</span>
						<span>{supplier?.address?.townCity}</span>
						<span>{supplier?.address?.country}</span>
					</VStack>
				</HStack>
			</Panel>
		</PanelGroup>
	)
}
export default SupplierCard
