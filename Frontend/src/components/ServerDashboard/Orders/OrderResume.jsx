/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react';
import { OrderContext } from '../../../context/OrderContext';
import { useOrderActions } from '../../../hooks/useOrderActions';
import { AuthContext } from '../../../context/AuthContext';
import { MenuServer } from '../MenuServer';

export const OrderResume = ({ onClose, setOpenLayout, setOrderForm }) => {
	const { state: prevOrder } = useContext(OrderContext);
	const { state: serverState } = useContext(AuthContext);
	const { addOrderAction, deleteOrderPrevAction } = useOrderActions();
	const [orders, setOrders] = useState([]);
	const [confirmOrder, setConfirmOrder] = useState(false);

	// VERIFICA SI LOS ITEMS TIENE PENDING. SI FALSE... COLOCA FALSE EN PENDING
	useEffect(() => {
		if (prevOrder.prevOrder) {
			setOrders(
				prevOrder.prevOrder.map((order) => ({
					...order,
					items: order.items.map((item) => ({
						...item,
						pending: item.pending ?? false,
					})),
				}))
			);
		}
	}, [prevOrder.prevOrder]);

	// MODIFICA EL ESTADO DE PENDING EN CADA ITEM
	const handleCheckboxChange = (orderIndex, itemIndex) => {
		const updatedOrders = [...orders];
		updatedOrders[orderIndex].items[itemIndex].pending =
			!updatedOrders[orderIndex].items[itemIndex].pending;
		setOrders(updatedOrders);
	};

	// FUNCION PARA COMFIRMAR LA ORDEN Y ENVIAR A COCINA. BORRA LA PREVORDER DEL REDUCER Y VUELVE AL LAYOUT
	const handleConfirm = async () => {
		try {
			await addOrderAction(orders);
			setConfirmOrder(true);
			await deleteOrderPrevAction(prevOrder.prevOrder[0].tableId);
			setOrderForm(false);
			setOpenLayout(true);
		} catch (error) {
			console.error('Error al confirmar la orden:', error);
		}
	};

	return (
		<div className=''>
			{confirmOrder ? (
				<MenuServer />
			) : (
				<>
					{orders.length > 0 && (
						<>
							{orders.map((order, orderIndex) => (
								<div
									key={orderIndex}
									className='border-b-2 border-gray-300 pb-2 mb-2'>
									<p className='text-lg font-semibold mb-1 '>
										{order.salonName} - Mesa {order.tableNum}
									</p>
									<p className='mt-3'>
										<span className='font-semibold'>Server:</span>{' '}
										{serverState.user && serverState.user.displayName}
									</p>
									<p className='mb-3'>
										<span className='font-semibold'>Comensales:</span>{' '}
										{order.diners}
									</p>

									{order.items.map((item, itemIndex) => (
										<div key={itemIndex} className='ml-4'>
											<p className='font-semibold border-t-2 border-slate-300'>
												{item.name}
											</p>
											<p className='text-gray-700'>
												Cantidad: {item.quantity}
											</p>
											<p className='text-gray-600'>
												Observaciones: {item.text}
											</p>
											<div className='ml-4 mt-2'>
												<label className='inline-flex items-center'>
													<input
														type='checkbox'
														checked={item.pending}
														onChange={() =>
															handleCheckboxChange(
																orderIndex,
																itemIndex
															)
														}
														className='form-checkbox h-5 w-5 text-green-600'
													/>
													<span className='ml-2 text-gray-700'>
														Pendiente
													</span>
												</label>
											</div>
										</div>
									))}
								</div>
							))}
						</>
					)}

					<div className='flex flex-wrap items-center justify-around mt-3'>
						<button
							onClick={handleConfirm}
							className='text-white p-2 rounded-full hover:bg-green-800 hover:text-green-800'>
							<i className='fa-solid fa-circle-check text-[40px] text-green-800 hover:text-white'></i>
						</button>
						<button
							type='button'
							className='text-white p-2 rounded-full hover:bg-red-800 hover:text-red-800'
							onClick={onClose}>
							<i className='fa-solid fa-circle-xmark text-[40px] text-red-800 hover:text-white'></i>
						</button>
					</div>
				</>
			)}
		</div>
	);
};
