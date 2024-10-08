/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext, useState, useMemo } from 'react';
import { FaPause, FaPlay, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Table } from '../../../../utils/Table';
import Modals from '../../../../utils/Modals';
import ProductForm from './SupplierForm';
import { ProductContext } from '../../../../context/ProductContext';
import { Button } from 'react-bootstrap';
import { useSupplierActions } from '../../../../hooks/useSupplierActions.js';
import Loader from '../../../../utils/Loader';
import useModal from '../../../../hooks/useModal.js';

export const SupplierDashboard = () => {
	const { state } = useContext(ProductContext);
	const {
		dataSuppliers,
		disableSupplierAction,
		enableSupplierAction,
		deleteSupplierAction,
	} = useSupplierActions();
	const [rowId, setRowId] = useState(null);

	// CARGA LOS DATOS DE PROVEEDORES
	useEffect(() => {
		dataSuppliers();
	}, []);

	// APERTURA Y CIERRE DE MODALES
	const {
		isOpen: isEditModalOpen,
		openModal: openEditModal,
		closeModal: closeEditModal,
	} = useModal();

	const {
		isOpen: isAddModalOpen,
		openModal: openAddModal,
		closeModal: closeAddModal,
	} = useModal();

	// CONFIGURA COLUMNS PARA LA TABLE
	const columns = useMemo(
		() => [
			{
				header: 'Nombre',
				accessorKey: 'name',
				enableColumnOrdering: false,
				size: 50,
			},
			{
				header: 'Email',
				accessorKey: 'email',
				enableColumnOrdering: false,
				size: 50,
			},
			{
				header: 'Telefono',
				accessorKey: 'tel',
				enableColumnOrdering: false,
				size: 50,
			},
			{
				header: 'Direccion',
				accessorKey: 'address',
				enableColumnOrdering: false,
				size: 50,
			},
			{
				header: 'CUIT',
				accessorKey: 'cuit',
				enableColumnOrdering: false,
				size: 50,
			},
			{
				header: 'Comentarios',
				accessorKey: 'comment',
				enableColumnOrdering: false,
				size: 50,
			},
			{
				header: 'Estado',
				accessorKey: 'status',
				enableColumnOrdering: false,
				size: 50,
				Cell: ({ row }) => {
					return row.original.status === true
						? 'Habilitado'
						: 'Suspendido';
				},
			},
		],
		[]
	);

	// CONFIGURA ACTIONS PARA LA TABLE
	const actions = [
		{
			text: 'Inhabilitar',
			icon: <FaPause />,
			onClick: (row) => {
				disableSupplierAction(row.original._id);
			},
		},
		{
			text: 'Habilitar',
			icon: <FaPlay />,
			onClick: (row) => {
				enableSupplierAction(row.original._id);
			},
		},
		{
			text: 'Editar',
			icon: <FaEdit />,
			onClick: (row) => {
				setRowId(row.original._id);
				openEditModal();
			},
		},
		{
			text: 'Eliminar',
			icon: <FaTrashAlt />,
			onClick: (row) => {
				deleteSupplierAction(row.original._id);
			},
		},
	];

	return (
		<>
			<div className='px-5 shadowIndex rounded-t-md bg-slate-700 flex flex-wrap flex-row items-center justify-around sm:justify-between'>
				<h3 className=' text-white text-xl font-semibold'>Proveedores</h3>
				<Button
					onClick={openAddModal}
					className='flex my-2 items-center text-sm border border-slate-800 bg-gradient-to-b from-slate-500 to-slate-800 hover:bg-gradient-to-b hover:from-slate-800 hover:to-slate-500 text-white  font-bold py-2 px-4 rounded'>
					<i className='pe-2 fa-solid fa-plus hover:text-slate-600'></i>
					Agregar Proveedor
				</Button>
			</div>
			{state.loading ? (
				<Loader />
			) : (
				<div className='table-responsive'>
					<Table
						columns={columns}
						data={state.suppliers}
						actions={actions}
						initialSortColumn='name'
					/>
				</div>
			)}
			<Modals
				isOpen={isEditModalOpen}
				onClose={closeEditModal}
				title='Editar Proveedor'>
				<ProductForm rowId={rowId} onClose={closeEditModal} mode='edit' />
			</Modals>
			<Modals
				isOpen={isAddModalOpen}
				onClose={closeAddModal}
				title='Agregar Nuevo Proveedor'>
				<ProductForm onClose={closeAddModal} mode='create' />
			</Modals>
		</>
	);
};
