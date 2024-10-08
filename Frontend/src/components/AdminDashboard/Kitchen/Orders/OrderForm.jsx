/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { OrderContext } from '../../../../context/OrderContext';
import { useForm, FormProvider } from 'react-hook-form';
import { useOrderActions } from '../../../../hooks/useOrderActions.js';
import { Form } from 'react-bootstrap';
import { DateTime } from 'luxon';
import { Button } from 'primereact/button';
import OrderItem from './OrderItem';

const OrderForm = ({ rowId, onClose, mode = 'edit' }) => {
	const [order, setOrder] = useState({});
	const { state } = useContext(OrderContext);
	const { updateOrderAction, addOrderAction } = useOrderActions();
	const methods = useForm();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = methods;

	// FORMATEA LA FECHA A ZONA ARGENTINA
	const formatFecha = (fechaISO) => {
		const fechaUTC = DateTime.fromISO(fechaISO, { zone: 'utc' });
		const fechaBuenosAires = fechaUTC.setZone(
			'America/Argentina/Buenos_Aires'
		);
		return fechaBuenosAires.toFormat('dd/MM/yyyy - HH:mm:ss');
	};

	// CARGA DATOS DE LA ORDEN
	const loadOrder = () => {
		const order = state.orders.find((order) => order._id === rowId);
		if (order) {
			const fechaFormateadaOpen = formatFecha(order.openAt);
			const fechaFormateadaClose = order.closeTime
				? formatFecha(order.closeTime)
				: 'Sin datos de cierre';
			setValue('salonName', order.salonName);
			setValue('tableNum', order.tableNum);
			setValue('server', order.server);
			setValue('diners', order.diners);
			setValue('openAt', fechaFormateadaOpen);
			setValue('closeAt', fechaFormateadaClose);
			setValue('items', order.items);
			setOrder(order);
		}
	};

	// SI ES EDIT O VIEW EJECUTA LOADORDER
	useEffect(() => {
		if (mode === 'edit' || mode === 'view') {
			loadOrder();
		}
	}, [rowId, mode]);

	// PREPARA LOS VALUES P ENVIAR
	const onSubmit = handleSubmit(async (values) => {
		try {
			const orderData = {
				salonName: values.salonName,
				tableNum: values.tableNum,
				diners: values.diners,
				server: values.server,
				openAt: values.openAt,
				closeAt: values.closeAt,
				items: values.items,
			};
			if (mode === 'edit') {
				// SI EDIT ABRE MODAL DE EDICION
				await updateOrderAction(rowId, orderData);
			} else {
				// SI ADD ABRE MODAL PARA AGREGAR ORDER
				await addOrderAction(orderData);
			}
			onClose();
		} catch (error) {
			console.error(error);
		}
	});

	// CALCULA LA CANTIDAD DE ITEMS DE LA ORDEN Y EL PRECIO TOTAL
	const items = order.items || [];
	const { totalItems, totalPrice } = items.reduce(
		(acc, item) => {
			acc.totalItems += item.quantity;
			acc.totalPrice += item.price * item.quantity;
			return acc;
		},
		{ totalItems: 0, totalPrice: 0 }
	);

	return (
		<FormProvider {...methods}>
			<Form onSubmit={onSubmit}>
				<div className='flex flex-row flex-wrap items-center justify-around'>
					<Form.Group controlId='salon'>
						<Form.Label className='text-start bg-transparent text-xl mb-0 mt-2 text-background w-full font-medium'>
							Salon
						</Form.Label>
						<Form.Control
							type='text'
							className={`${
								mode === 'view' || mode === 'edit'
									? 'border-none focus:border-none focus:outline-none bg-transparent'
									: ''
							}`}
							{...register('salonName', {
								required: 'El nombre del salon es requerido',
							})}
							readOnly={mode === 'view' || mode === 'edit'}
						/>
						{errors.salonName && (
							<span className='text-warning fs-6'>
								{errors.salonName.message}
							</span>
						)}
					</Form.Group>
					<Form.Group controlId='tableNum'>
						<Form.Label className='text-start bg-transparent text-xl mb-0 mt-2 text-background w-full font-medium'>
							Mesa
						</Form.Label>
						<Form.Control
							type='number'
							className={`${
								mode === 'view' || mode === 'edit'
									? 'border-none focus:border-none focus:outline-none bg-transparent'
									: ''
							}`}
							{...register('tableNum', {
								required: 'El numero de mesa es requerido',
							})}
							readOnly={mode === 'view' || mode === 'edit'}
						/>
						{errors.tableNum && (
							<span className='text-warning fs-6'>
								{errors.tableNum.message}
							</span>
						)}
					</Form.Group>
				</div>
				<div className='flex flex-row flex-wrap items-center justify-around'>
					<Form.Group controlId='diners'>
						<Form.Label className='text-start bg-transparent text-xl mb-0 mt-2 text-background w-full font-medium'>
							Personas
						</Form.Label>
						<Form.Control
							type='number'
							className={`${
								mode === 'view'
									? 'border-none focus:border-none focus:outline-none bg-transparent'
									: ''
							}`}
							{...register('diners', {
								required: 'La cantidad de personas es requerida',
							})}
							readOnly={mode === 'view'}></Form.Control>
						{errors.diners && (
							<span className='text-warning fs-6'>
								{errors.diners.message}
							</span>
						)}
					</Form.Group>
					<Form.Group controlId='server'>
						<Form.Label className='text-start bg-transparent text-xl mb-0 mt-2 text-background w-full font-medium'>
							Server
						</Form.Label>
						<Form.Control
							type='text'
							className={`${
								mode === 'view' || mode === 'edit'
									? 'border-none focus:border-none focus:outline-none bg-transparent'
									: ''
							}`}
							{...register('server', {
								required: 'El nombre del server es requerido',
							})}
							readOnly={mode === 'view' || mode === 'edit'}
						/>
						{errors.server && (
							<span className='text-warning fs-6'>
								{errors.server.message}
							</span>
						)}
					</Form.Group>
				</div>
				<div className='flex flex-row flex-wrap items-center justify-around'>
					<Form.Group controlId='openAt'>
						<Form.Label className='text-start bg-transparent text-xl mb-0 mt-2 text-background w-full font-medium'>
							Apertura
						</Form.Label>
						<Form.Control
							type='text'
							className='border-none focus:border-none focus:outline-none bg-transparent'
							{...register('openAt')}
							readOnly
						/>
					</Form.Group>
					<Form.Group controlId='closeAt'>
						<Form.Label className='text-start bg-transparent text-xl mb-0 mt-2 text-background w-full font-medium'>
							Cierre
						</Form.Label>
						<Form.Control
							type='text'
							className='border-none focus:border-none focus:outline-none bg-transparent'
							{...register('closeAt')}
							readOnly
						/>
					</Form.Group>
				</div>
				<h2 className='text-2xl font-bold text-center text-slate-600'>
					Items
				</h2>
				<div className='flex flex-row flex-wrap items-center justify-around w-full text-slate-600'>
					<p className='w-5/12 text-center font-semibold'>Nombre</p>
					<p className='w-1/12 text-center font-semibold'>Cant</p>
					<p className='w-3/12 text-center font-semibold'>Precio</p>
					<p className='w-3/12 text-center font-semibold'>Subtotal</p>
				</div>
				<div className='w-full'>
					{items.map((item, index) => (
						<OrderItem
							key={index}
							item={item}
							index={index}
							mode={mode}
						/>
					))}
				</div>
				<Form.Group className='flex flex-wrap items-center justify-around mt-3'>
					{mode !== 'view' && (
						<Button
							type='submit'
							tooltip='Confirmar'
							tooltipOptions={{ position: 'top' }}
							className='noborder text-white p-2 rounded-full hover:bg-green-800 hover:text-green-800'>
							<i className='fa-solid fa-circle-check text-[40px] text-green-800 hover:text-white'></i>
						</Button>
					)}
					<Button
						type='button'
						tooltip='Cerrar'
						tooltipOptions={{ position: 'top' }}
						className='noborder text-white p-2 rounded-full hover:bg-red-800 hover:text-red-800'
						onClick={onClose}>
						<i className='fa-solid fa-circle-xmark text-[40px] text-red-800 hover:text-white'></i>
					</Button>
				</Form.Group>
			</Form>
		</FormProvider>
	);
};

export default OrderForm;
