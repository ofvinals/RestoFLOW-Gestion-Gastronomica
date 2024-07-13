/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import '../../css/Custom.css';

export const PanelDashboard = ({
	handleUser,
	handleProduct,
	handleMenu,
	handleSalon,
	handleKitchen,
	handleReports,
	handleCash,
}) => {
	const [activeButton, setActiveButton] = useState('usuarios');

	// ABRE LA SECCION DE USUARIOS EN CADA RECARGA DE LA PAGINA
	useEffect(() => {
		handleUser();
	}, []);

	return (
		<section>
			<div className='flex flex-row flex-wrap justify-around items-end sm:h-[75px]'>
				<button
					onClick={() => {
						handleUser();
						setActiveButton('usuarios');
					}}
					className={`mx-3 border-none  p-3  ${
						activeButton === 'usuarios'
							? 'bg-slate-600 text-white rounded-t-lg shadowIndex font-bold'
							: 'bg-transparent text-white hover:text-black hover:font-bold'
					}`}>
					Usuarios
				</button>
				<button
					onClick={() => {
						handleProduct();
						setActiveButton('productos');
					}}
					className={`mx-3 border-none p-3  ${
						activeButton === 'productos'
							? 'bg-slate-600 text-white rounded-t-lg shadowIndex font-bold'
							: 'bg-transparent text-white hover:text-black hover:font-bold'
					}`}>
					Productos
				</button>
				<button
					onClick={() => {
						handleMenu();
						setActiveButton('cartaMenu');
					}}
					className={`mx-3 border-none p-3   ${
						activeButton === 'cartaMenu'
							? 'bg-slate-600 text-white rounded-t-lg shadowIndex font-bold'
							: 'bg-transparent text-white hover:text-black hover:font-bold'
					}`}>
					Carta
				</button>
				<button
					onClick={() => {
						handleSalon();
						setActiveButton('salon');
					}}
					className={`mx-3 border-none p-3   ${
						activeButton === 'salon'
							? 'bg-slate-600 text-white rounded-t-lg shadowIndex font-bold'
							: 'bg-transparent text-white hover:text-black hover:font-bold'
					}`}>
					Salon
				</button>
				<button
					onClick={() => {
						handleKitchen();
						setActiveButton('monitorCocina');
					}}
					className={`mx-3 border-none p-3   ${
						activeButton === 'monitorCocina'
							? 'bg-slate-600 text-white rounded-t-lg shadowIndex font-bold'
							: 'bg-transparent text-white hover:text-black hover:font-bold'
					}`}>
					Cocina
				</button>
				<button
					onClick={() => {
						handleCash();
						setActiveButton('caja');
					}}
					className={`mx-3 border-none p-3   ${
						activeButton === 'caja'
							? 'bg-slate-600 text-white rounded-t-lg shadowIndex font-bold'
							: 'bg-transparent text-white hover:text-black hover:font-bold'
					}`}>
					Caja
				</button>
				<button
					onClick={() => {
						handleReports();
						setActiveButton('reportes');
					}}
					className={`mx-3 border-none p-3   ${
						activeButton === 'reportes'
							? 'bg-slate-600 text-white rounded-t-lg shadowIndex font-bold'
							: 'bg-transparent text-white hover:text-black hover:font-bold'
					}`}>
					Reportes
				</button>
			</div>
		</section>
	);
};
