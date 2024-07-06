/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from 'react';
import RestaurantLayout from './Layout/RestaurantLayout';
import { LoungeContext } from '../../context/LoungeContext.jsx';
import { useLoungeActions } from '../../hooks/useLoungeActions.jsx';

export const MenuServer = ({ reload, onReload }) => {
	const { state } = useContext(LoungeContext);
	const [activeSalonId, setActiveSalonId] = useState(null);
	const { dataSalons } = useLoungeActions();

	useEffect(() => {
		dataSalons();
	}, [reload]); // Depend on reload to refresh data

	useEffect(() => {
		if (!activeSalonId && state.lounges && state.lounges.length > 0) {
			setActiveSalonId(state.lounges[0]._id);
		}
	}, [state.lounges]);

	const handleSalonClick = (salonNum) => {
		setActiveSalonId(salonNum);
	};
	const handleReload = () => {
		window.location.reload();
	};

	return (
		<section>
			<div className='pt-3 shadowIndex rounded-t-md bg-slate-600 flex flex-wrap flex-row justify-around'>
				{state.lounges && state.lounges.length > 0 && (
					<div className='w-full flex flex-row flex-wrap items-center justify-around'>
						{state.lounges.map((salon) => (
							<button
								key={salon._id}
								onClick={() => handleSalonClick(salon._id)}
								className={`border-none text-white p-2 ${
									activeSalonId === salon._id
										? 'bg-slate-700 text-white rounded-t-lg shadowIndex'
										: 'bg-transparent text-white hover:font-bold'
								}`}>
								{salon.name}
							</button>
						))}
					</div>
				)}
			</div>
			<div className='flex w-full'>
				{activeSalonId !== null && (
					<RestaurantLayout
						onReload={handleReload}
						salonId={activeSalonId}
						salonName={
							state.lounges.find((salon) => salon._id === activeSalonId)
								?.name || 'Nombre no encontrado'
						}
					/>
				)}
			</div>
		</section>
	);
};
export default MenuServer;
