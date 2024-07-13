/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from 'react';
import { useCategoryActions } from '../../../hooks/useCategoryActions';
import { MenuContext } from '../../../context/MenuContext';

export const CategorySelection = ({ onCategorySelect }) => {
	const { dataCategorys } = useCategoryActions();
	const { state } = useContext(MenuContext);

	// CARGA LAS CATEGORIAS 
	useEffect(() => {
		dataCategorys();
	}, []);
	const categorys = state.categorys;
	
	return (
		<div className='flex flex-row flex-wrap w-full items-center justify-around my-5 '>
			<button
				onClick={() => onCategorySelect(null)}
				className='flex items-center text-sm border border-slate-800 bg-gradient-to-b from-slate-500 to-slate-800 hover:from-slate-to-slate-800 text-white hover:text-white font-bold py-2 px-4 rounded'>
				Todos
			</button>
			{categorys &&
				categorys.map((category, id) => (
					<button
						className={`flex items-center text-sm border border-slate-800 bg-gradient-to-b from-slate-500 to-slate-800 hover:from-slate-to-slate-800 text-white hover:text-white font-bold py-2 px-4 rounded ${
							onCategorySelect === category.name
								? 'bg-green-700  rounded-t-lg shadowIndex'
								: 'bg-slate-700 hover:font-bold'
						}`}
						key={id}
						onClick={() => onCategorySelect(category.name)}
						value={category.name}>
						{category.name}
					</button>
				))}
		</div>
	);
};
