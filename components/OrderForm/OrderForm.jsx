'use client'
import AddDiscountPopover from '@/components/AddDiscountPopover/AddDiscountPopover'
import { roundMoney } from '@/utils/functions'
import Image from 'next/image'
import { useState } from 'react'
import {
	Button,
	Col,
	Grid,
	Input,
	InputNumber,
	Panel,
	PanelGroup,
	Row,
	SelectPicker,
	Stack,
	Steps,
	Text,
} from 'rsuite'
import OrderStatusPanel from '../OrderStatusPanel/OrderStatusPanel'
const OrderForm = ({ order }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [orderDetails, setOrderDetails] = useState({
		user: order.user,
		contact: {
			firstName: order.contact.firstName,
			lastName: order.contact.lastName,
			email: order.contact.email,
			phone: order.contact.firstName,
		},
		billing: {
			firstName: order.billing.firstName,
			lastName: order.billing.lastName,
			email: order.billing.email,
			region: order.billing.region,
			town: order.billing.town,
			address: order.billing.address,
		},
		shipping: {
			firstName: order?.shipping?.firstName || '',
			lastName: order?.shipping?.lastName || '',
			phone: order?.shipping?.email || '',
			region: order?.shipping?.region || '',
			town: order?.shipping?.town || '',
			address: order?.shipping?.address || '',
			method: order.shipping.method,
			status: order.shipping.status,
			cost: order.shipping.cost,
		},
		status: order.status,
		rate: order.rate,
		discount: {
			percentage: order.discount.percentage,
			value: order.discount.value,
			reason: order?.discount?.reason || '',
		},
		products: order.products,
		payment: {
			method: order.payment.method,
			status: order.payment.status,
		},
		subtotal: order.subtotal,
		total: order.total,
		notes: order?.notes || '',
	})

	return (
		<Grid fluid>
			<Row style={{ marginBottom: 10 }}>
				<Col xs={24}>
					<OrderStatusPanel
						orderDetails={orderDetails}
						setOrderDetails={setOrderDetails}
					/>
				</Col>
			</Row>
			{/* <Row>
    <Col xs={16}>
      <PanelGroup bordered>
        <Panel
          header='Order details'
        >
         {
           items.map(item => (
            <Row key={item.product._id}>
              <Col xs={24} style={{ marginBottom: 20 }}>
                <Stack
                  justifyContent='space-between'
                  alignItems='center'
                  style={{ fontSize: 12, color: '#D4D4D4' }}
                >
                  <Stack spacing={15} style={{ width: 360 }}>
                    <div
                      style={{
                        position: 'relative',
                        height: 60,
                        width: 60,
                        objectFit: 'contain',
                      }}
                    >
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.title}
                        fill
                        sizes='(max-width: 768px) 60px, (max-width: 1200px) 60px, 60px'
                      />
                    </div>
                    <Stack direction='column' alignItems='flex-start'>
                      <span style={{ color: '#6CD6FF' }}>
                        {item.product.title}
                      </span>
                      <span>{item.product.brand.name}</span>
                    </Stack>
                  </Stack>

                  <span style={{ display: 'flex', width: 100 }}>
                    GHS {roundMoney(item.product.sellPrice * rate)}
                  </span>

                  <span>x</span>

                  <span>{item.quantity}</span>

                  <span style={{ display: 'flex', width: 100 }}>
                    GHS{' '}
                    {roundMoney(
                      item.product.sellPrice * item.quantity * rate
                    )}
                  </span>

                </Stack>
              </Col>
            </Row>
          ))
         }

          <Row style={{ marginTop: 30 }}>
            <Col xs={14}>
              <Text style={{ marginBottom: 5 }}>Notes:</Text>
              <Input
                as='textarea'
                placeholder='Add a note...'
                value={orderDetails.notes}
                onChange={notes =>
                  setOrderDetails(prev => ({ ...prev, notes }))
                }
                disabled={isLoading}
              />
            </Col>

            <Col xs={10} style={{ fontSize: 12, color: '#D4D4D4' }}>
              <Row
                style={{
                  textAlign: 'right',
                  marginBottom: 12,
                }}
              >
                <Col xs={9}>
                  <AddDiscountPopover
                    orderDetails={orderDetails}
                    setOrderDetails={setOrderDetails}
                    cartItemsTotal={cartItemsTotal}
                    isLoading={isLoading}
                    rate={rate}
                  />
                </Col>
                <Col xs={15}>
                  <Text>% {orderDetails.discount.percentage}</Text>
                </Col>
              </Row>

              <Row style={{ textAlign: 'right', marginBottom: 12 }}>
                <Col xs={9}>
                  <Text>Subtotal</Text>
                </Col>
                <Col xs={15}>
                  <Text>GHS {roundMoney(subtotal)}</Text>
                </Col>
              </Row>

              <Row style={{ textAlign: 'right', marginBottom: 12 }}>
                <Col xs={9}>
                  <AddShippingPopover
                    orderDetails={orderDetails}
                    setOrderDetails={setOrderDetails}
                    rate={rate}
                    isLoading={isLoading}
                  />
                </Col>
                <Col xs={15}>
                  <Text>
                    GHS {roundMoney(orderDetails.shipping.cost * rate)}
                  </Text>
                </Col>
              </Row>

              <Row style={{ textAlign: 'right' }}>
                <Col xs={9}>
                  <Text>Total</Text>
                </Col>
                <Col xs={15}>
                  <Text>GHS {roundMoney(total)}</Text>
                </Col>
              </Row>
            </Col>
          </Row>
        </Panel>
        <Panel
          header={
            <Stack justifyContent='space-between'>
              <span>Payment method</span>
              <SelectPicker
                data={[
                  { label: 'Pending', value: 'pending' },
                  { label: 'Paid', value: 'paid' },
                ]}
                label='Status'
                searchable={false}
                cleanable={false}
                style={{ width: 224 }}
                defaultValue={orderDetails.payment.status}
                onSelect={status =>
                  setOrderDetails(prev => ({
                    ...prev,
                    payment: { ...orderDetails.payment, status },
                  }))
                }
                disabled={isLoading}
              />
            </Stack>
          }
        >
          <RadioGroup
            value={orderDetails.payment.method}
            onChange={method =>
              setOrderDetails(prev => ({
                ...prev,
                payment: { ...orderDetails.payment, method },
              }))
            }
            disabled={isLoading}
          >
            <Radio value='cash'>Cash</Radio>
            <Radio value='mobile money' disabled>
              Mobile money
            </Radio>
          </RadioGroup>
        </Panel>

        <Panel
          header={
            <Stack justifyContent='space-between'>
              <span>Shipment method</span>
              <SelectPicker
                data={[
                  { label: 'Pending', value: 'pending' },
                  { label: 'Completed', value: 'completed' },
                ]}
                label='Status'
                searchable={false}
                cleanable={false}
                style={{ width: 224 }}
                defaultValue={orderDetails.shipping.status}
                onSelect={status =>
                  setOrderDetails(prev => ({
                    ...prev,
                    shipping: { ...orderDetails.shipping, status },
                  }))
                }
                disabled={isLoading}
              />
            </Stack>
          }
        >
          <RadioGroup
            value={orderDetails.shipping.method}
            onChange={method =>
              setOrderDetails(prev => ({
                ...prev,
                shipping: {
                  ...orderDetails.shipping,
                  method,
                  cost: method === 'pickup' && 0,
                },
              }))
            }
            disabled={isLoading}
          >
            <Radio value='pickup'>Pickup</Radio>
            <Radio value='delivery'>Delivery</Radio>
          </RadioGroup>
        </Panel>
      </PanelGroup>
    </Col>
    <Col xs={8}>
      {!customer ? (
        <Panel
          bordered
          header={
            <Stack justifyContent='space-between'>
              <span>Find or create a customer</span>
              <Button
                appearance='link'
                size='sm'
                style={{ padding: 0 }}
                onClick={() => dispatch(setDrawerOpen({ mode: 'add' }))}
              >
                Create customer
              </Button>
            </Stack>
          }
        >
          <InputPicker
            onSearch={searchUsers}
            placeholder='Find customer'
            data={users.map(user => {
              return {
                label: genFullName(user.firstName, user.lastName),
                value: JSON.stringify(user),
              }
            })}
            onSelect={value => {
              const data = JSON.parse(value)
              const preparedData = {
                user: data._id,
                contact: {
                  firstName: data.firstName,
                  lastName: data.lastName,
                  email: data.email,
                  phone: data.phone1,
                },
                billingActive: data.billingActive,
                billing: {
                  firstName: data?.billing?.firstName,
                  lastName: data?.billing?.lastName,
                  region: data?.billing?.region,
                  town: data?.billing?.town,
                  address: data?.billing?.address,
                  email: data?.billing?.email,
                },
                shipping: data?.shipping.find(
                  address => address.isPrimary
                ),
                profileImg: data?.profileImg || null,
              }
              setCustomer(preparedData)
            }}
            block
            renderMenu={menu => {
              if (loading) {
                return (
                  <p
                    style={{
                      padding: 10,
                      color: '#999',
                      textAlign: 'center',
                    }}
                  >
                    <SpinnerIcon spin /> Loading...
                  </p>
                )
              }
              return menu
            }}
          />
        </Panel>
      ) : (
        <PanelGroup bordered>
          <Panel
            header={
              <Stack justifyContent='space-between'>
                <span>Customer</span>
                <Stack spacing={10}>
                  <Button
                    appearance='link'
                    size='sm'
                    style={{ padding: 0 }}
                    onClick={() => {
                      dispatch(
                        setDrawerOpen({
                          mode: 'edit',
                          data: customer,
                        })
                      )
                    }}
                    disabled={isLoading}
                  >
                    Edit
                  </Button>
                  <Button
                    appearance='link'
                    size='sm'
                    style={{ padding: 0 }}
                    onClick={() => setCustomer(null)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            }
          >
            <Stack spacing={17} style={{ fontSize: 15 }}>
              <div
                style={{
                  position: 'relative',
                  height: 80,
                  width: 80,
                  objectFit: 'contain',
                  borderRadius: '50%',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={customer?.profileImg?.url || '/images/profile.png'}
                  alt={genFullName(
                    customer.contact.firstName,
                    customer.contact.lastName
                  )}
                  fill
                  sizes='(max-width: 768px) 80px, (max-width: 1200px) 80px, 80px'
                />
              </div>
              <Stack direction='column' alignItems='flex-start'>
                <span style={{ color: '#6CD6FF' }}>
                  {genFullName(
                    customer.contact.firstName,
                    customer.contact.lastName
                  )}
                </span>
                <span style={{ color: '#D4D4D4', fontSize: 13 }}>
                  {customer.contact.email}
                </span>
                <span style={{ color: '#D4D4D4', fontSize: 13 }}>
                  {customer.contact.phone}
                </span>
              </Stack>
            </Stack>
          </Panel>

          <Panel header='Billing address'>
            {customer.billingActive ? (
              <Stack
                direction='column'
                alignItems='flex-start'
                style={{ color: '#D4D4D4', fontSize: 13 }}
              >
                <div>
                  {customer?.billing?.firstName}{' '}
                  {customer?.billing?.lastName}
                </div>
                <div>{customer?.billing?.email}</div>
                <div>{customer?.billing?.address}</div>
                <div>
                  {customer?.billing?.town}, {customer?.billing?.region}
                </div>
              </Stack>
            ) : (
              <p style={{ color: '#D4D4D4', fontSize: 13 }}>
                A billing address has not been set.
              </p>
            )}
          </Panel>

          {orderDetails.shipping.method === 'delivery' && (
            <Panel header='Shipping address'>
              {customer.shipping ? (
                <Stack
                  direction='column'
                  alignItems='flex-start'
                  style={{ color: '#D4D4D4', fontSize: 13 }}
                >
                  <div>
                    {customer.shipping?.firstName}{' '}
                    {customer.shipping?.lastName}
                  </div>
                  <div>{customer.shipping?.phone}</div>
                  <div>{customer.shipping?.address}</div>
                  <div>
                    {customer.shipping?.town}, {customer.shipping?.region}
                  </div>
                </Stack>
              ) : (
                <p style={{ color: '#D4D4D4', fontSize: 13 }}>
                  A shipping address has not been set.
                </p>
              )}
            </Panel>
          )}
        </PanelGroup>
      )}
    </Col>
  </Row> */}
		</Grid>
	)
}
export default OrderForm
