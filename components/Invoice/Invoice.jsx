import {
	Document,
	Font,
	Image,
	Page,
	StyleSheet,
	Text,
	View,
} from '@react-pdf/renderer'
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
	],
})

// Create styles
const styles = StyleSheet.create({
	page: {
		flexDirection: 'column',
		fontFamily: 'Nunito',
		backgroundColor: 'white',
		color: '#555555',
		fontSize: 13,
	},
	section: {
		margin: '0 10px',
		padding: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	invoiceTitle: {
		fontSize: 35,
		color: '#555555',
		fontWeight: 'semibold',
		textTransform: 'uppercase',
	},
	companyName: {
		fontSize: 13,
		fontWeight: 'semibold',
	},

	subsection: {
		display: 'flex',
		flexDirection: 'column',
	},
	subsectionTitle: {
		fontWeight: 'semibold',
		color: '#222222',
		textTransform: 'uppercase',
		marginBottom: 3,
	},
	logo: {
		width: 130,
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
		padding: '8px',
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

const Invoice = ({ data }) => {
	return (
		<Document>
			<Page size='A4' style={styles.page}>
				<View style={styles.section}>
					<View>
						<Image
							src={'https://portal.bs42.net/images/logo.png'}
							style={styles.logo}
						/>
					</View>
					<View>
						<Text style={styles.invoiceTitle}>Invoice</Text>
					</View>
				</View>

				<View style={styles.section}>
					<View>
						<Text style={styles.companyName}>BS42.NET</Text>
						<Text>Tycan House, House NO. 43</Text>
						<Text>Tetteh Okuley Ave.</Text>
						<Text>Abofu - Achimota</Text>
					</View>
				</View>

				<View style={{ ...styles.section }}>
					<View style={styles.subsection}>
						<Text style={styles.subsectionTitle}>Sold To</Text>
						<Text>{`${data.customerInfo.firstName} ${data.customerInfo.lastName}`}</Text>
						<Text>Client&apos;s Address</Text>
						<Text>City, State Zip</Text>
						<Text>Ghana</Text>
					</View>

					<View style={styles.subsection}>
						<Text style={styles.subsectionTitle}>Invoice Summary</Text>
						<Text>Invoice Date: Mar 01, 2024</Text>
						<Text>Invoice Number: INV13506143</Text>
						<Text>Due Date: Mar 01, 2024</Text>
					</View>
				</View>
				<View
					style={[
						styles.section,
						{ flexDirection: 'column', alignItems: 'flex-end', rowGap: 10 },
					]}
				>
					<View>
						<Text style={styles.subsectionTitle}>Ordered Items</Text>
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
								<View style={styles.tableRow}>
									<View style={styles.tableColumn1}>
										<Text>28 Port Switch</Text>
									</View>
									<View style={styles.tableColumn2}>
										<Text>2</Text>
									</View>
									<View style={styles.tableColumn3}>
										<Text>100.00</Text>
									</View>
									<View style={styles.tableColumn4}>
										<Text>200.00</Text>
									</View>
								</View>

								<View style={styles.tableRow}>
									<View style={styles.tableColumn1}>
										<Text>28 Port Switch</Text>
									</View>
									<View style={styles.tableColumn2}>
										<Text>2</Text>
									</View>
									<View style={styles.tableColumn3}>
										<Text>100.00</Text>
									</View>
									<View style={styles.tableColumn4}>
										<Text>200.00</Text>
									</View>
								</View>

								<View style={styles.tableRow}>
									<View style={styles.tableColumn1}>
										<Text>28 Port Switch</Text>
									</View>
									<View style={styles.tableColumn2}>
										<Text>2</Text>
									</View>
									<View style={styles.tableColumn3}>
										<Text>100.00</Text>
									</View>
									<View style={styles.tableColumn4}>
										<Text>200.00</Text>
									</View>
								</View>
							</View>
						</View>
					</View>

					<View style={styles.summaryBlock}>
						<View style={styles.summaryBlockSection}>
							<Text>Sub Total</Text>
							<Text style={styles.price}>GHS 200.00</Text>
						</View>
						<View style={styles.summaryBlockSection}>
							<Text>Sale Tax (10%)</Text>
							<Text style={styles.price}>GHS 20.00</Text>
						</View>
						<View style={[styles.summaryBlockSection, styles.last]}>
							<Text style={styles.totalText}>Total</Text>
							<Text style={styles.price}>GHS 220.00</Text>
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
export default Invoice
