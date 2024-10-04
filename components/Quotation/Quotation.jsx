import { roundMoney } from '@/utils/functions'
import {
	Document,
	Font,
	Image,
	Page,
	StyleSheet,
	Text,
	View,
} from '@react-pdf/renderer'
import { format } from 'date-fns'
import path from 'path'

const fontPath = path.resolve(process.cwd(), 'public/fonts')
const imagePath = path.resolve(process.cwd(), 'public/images')

// Register font
Font.register({
	family: 'Nunito',
	fonts: [
		{
			src: `${fontPath}/Nunito-Regular.ttf`,
			fontWeight: 'normal',
		},
		{
			src: `${fontPath}/Nunito-SemiBold.ttf`,
			fontWeight: 'semibold',
		},
		{
			src: `${fontPath}/Nunito-Bold.ttf`,
			fontWeight: 'bold',
		},
	],
})

// Create styles
const styles = StyleSheet.create({
	page: {
		flexDirection: 'column',
		fontFamily: 'Nunito',
		backgroundColor: 'white',
		color: '#555555',
		fontSize: 8,
	},
	section: {
		margin: '0 10px',
		padding: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	invoiceTitle: {
		fontSize: 18,
		color: '#555555',
		fontWeight: 'semibold',
		textTransform: 'uppercase',
	},
	companyName: {
		fontWeight: 'bold',
	},

	subsection: {
		display: 'flex',
		flexDirection: 'column',
	},
	subsectionTitle: {
		fontWeight: 'bold',
		color: '#222222',
		textTransform: 'uppercase',
		// marginBottom: 3,
	},
	logo: {
		width: 80,
	},
	table: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
	},
	tableHead: {
		backgroundColor: '#666',
		color: 'white',
		fontWeight: 'semibold',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: '5px 8px',
	},
	tableBody: {
		display: 'flex',
		flexDirection: 'column',
	},
	tableRow: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: '20px 8px',
		borderBottom: '1px solid #E8E8E8',
	},
	tableColumn1: {
		width: '52%',
	},
	tableColumn2: {
		width: '18%',
		alignItems: 'center',
	},
	tableColumn3: {
		width: '18%',
		alignItems: 'center',
	},
	tableColumn4: {
		width: '12%',
		alignItems: 'center',
	},
	summarySection: {
		justifyContent: 'flex-end',
	},
	summaryBlock: {
		width: '50%',
		display: 'flex',
		flexDirection: 'column',
	},
	summaryBlockSection: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: '8px 10px',
	},
	last: {
		backgroundColor: '#EBEBEB',
	},
	price: {
		fontWeight: 'semibold',
	},
	totalText: {
		fontWeight: 'semibold',
		textTransform: 'uppercase',
	},
})

const Quotation = ({ data }) => {
	return (
		<Document>
			<Page size='A4' style={styles.page}>
				<View style={styles.section}>
					<View>
						<Image
							src={'https://portal.bs42.net/images/logo.png'}
							style={styles.logo}
							alt='BS42.NET'
						/>
					</View>
					<View style={styles.subsection}>
						<Text style={styles.invoiceTitle}>Quotation</Text>
					</View>
				</View>

				<View style={styles.section}>
					<View style={styles.subsection}>
						<Text style={styles.subsectionTitle}>Bill From</Text>
						<Text>BS42.NET</Text>
						<Text>Tycan House, House NO. 43</Text>
						<Text>Tetteh Okuley Ave.</Text>
						<Text>Abofu - Achimota</Text>
					</View>

					<View style={styles.subsection}>
						<Text style={styles.subsectionTitle}>Bill To</Text>
						<Text>{`${data.billing.firstName} ${data.billing.lastName}`}</Text>
						<Text>{data.billing.email}</Text>
						<Text>{data.billing.address}</Text>
						<Text>{`${data.billing.town}, ${data.billing.region}`}</Text>
					</View>

					<View style={styles.subsection}>
						<Text style={styles.subsectionTitle}>Quotation Summary</Text>
						<Text>
							Date: {format(new Date(data.createdAt), 'yyyy-MM-dd')}
						</Text>
						<Text>Number: {data.quotationNumber}</Text>
					</View>
				</View>
				{data.shipping.method === 'delivery' && (
					<View style={styles.section}>
						<View style={styles.subsection}>
							<Text style={styles.subsectionTitle}>Shipped to</Text>
							<Text>{`${data.shipping.firstName} ${data.shipping.lastName}`}</Text>
							<Text>{data.shipping.phone}</Text>
							<Text>{data.shipping.address}</Text>
							<Text>{`${data.shipping.town}, ${data.shipping.region}`}</Text>
						</View>
					</View>
				)}

				<View
					style={[
						styles.section,
						{ flexDirection: 'column', alignItems: 'flex-end', rowGap: 10 },
					]}
				>
					<View>
						<View style={styles.table}>
							<View style={styles.tableHead}>
								<View style={styles.tableColumn1}>
									<Text>Item Description</Text>
								</View>
								<View style={styles.tableColumn2}>
									<Text>Quantity</Text>
								</View>
								<View style={styles.tableColumn3}>
									<Text>Unit Price</Text>
								</View>
								<View style={styles.tableColumn4}>
									<Text>Total</Text>
								</View>
							</View>
							<View style={styles.tableBody}>
								{data.products.map((product, i) => (
									<View style={styles.tableRow} key={i}>
										<View style={styles.tableColumn1}>
											<Text>{product.title}</Text>
										</View>
										<View style={styles.tableColumn2}>
											<Text>{product.quantity}</Text>
										</View>
										<View style={styles.tableColumn3}>
											<Text>GHS {roundMoney(product.price * data.rate)}</Text>
										</View>
										<View style={styles.tableColumn4}>
											<Text>
												GHS{' '}
												{roundMoney(product.price * product.quantity * data.rate)}
											</Text>
										</View>
									</View>
								))}
							</View>
						</View>
					</View>

					<View style={styles.summaryBlock}>
						{data.discount.value > 0 && (
							<View style={styles.summaryBlockSection}>
								<View style={{ width: '80%' }}>
									<Text>
										Discount{' '}
										{data.discount.type === 'percentage' &&
											`(${data.discount.value}%)`}
									</Text>
								</View>
								<View style={{ width: '20%' }}>
									<Text style={styles.price}>
										GHS {roundMoney(data.discount.equivalent)}
									</Text>
								</View>
							</View>
						)}
						<View style={styles.summaryBlockSection}>
							<View style={{ width: '80%' }}>
								<Text>Sub Total</Text>
							</View>
							<View style={{ width: '20%' }}>
								<Text style={styles.price}>
									GHS {roundMoney(data.subtotal * data.rate)}
								</Text>
							</View>
						</View>

						{data.shipping.method === 'delivery' && (
							<View style={styles.summaryBlockSection}>
								<View style={{ width: '80%' }}>
									<Text>Shipping</Text>
								</View>
								<View style={{ width: '20%' }}>
									<Text style={styles.price}>
										GHS {roundMoney(data.shipping.cost * data.rate)}
									</Text>
								</View>
							</View>
						)}

						<View style={[styles.summaryBlockSection, styles.last]}>
							<View style={{ width: '80%' }}>
								<Text style={styles.totalText}>Total</Text>
							</View>
							<View style={{ width: '20%' }}>
								<Text style={styles.price}>
									GHS {roundMoney(data.total * data.rate)}
								</Text>
							</View>
						</View>
					</View>
				</View>

				<View
					style={[
						styles.section,
						{
							flexDirection: 'column',
							alignItems: 'flex-start',
							rowGap: 15,
							position: 'absolute',
							bottom: 0,
						},
					]}
				>
					<View>
						<Text style={styles.subsectionTitle}>Notes</Text>
						<Text>It was great doing business with you.</Text>
					</View>
					<View>
						<Text style={styles.subsectionTitle}>Terms & Conditions</Text>
						<Text>Please make the payment by the due date.</Text>
					</View>
				</View>
			</Page>
		</Document>
	)
}
export default Quotation
