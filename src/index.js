import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'remixicon/fonts/remixicon.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { BrowserRouter as Router } from 'react-router-dom';
// thêm mới phần modal //
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
//
const root = ReactDOM.createRoot(document.getElementById('root'));
// thêm khai báo phần modal
const client = new QueryClient();

root.render(
	<React.StrictMode>
		<QueryClientProvider client={client}>
			<Router>
				<App />
			</Router>
		</QueryClientProvider>
	</React.StrictMode>
	//them modal
);
