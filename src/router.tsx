import Customer from "./pages/Customer";
import CustomerGroup from "./pages/CustomerGroup";
import InvoiceImport from "./pages/InvImport";
import InvoiceImportCreate from "./pages/InvImportCreate";
import Product from "./pages/Product";
import Provider from "./pages/Provider";


const routes = [
	{
		index: true,
		element: (
			<Product />
		),
		state: "product",
		path: "product",
	},
	{
		index: true,
		element: (
			<InvoiceImport />
		),
		state: "kho/nhapkho",
		path: "kho/nhapkho",
	},
	{
		index: true,
		element: (
			<InvoiceImportCreate />
		),
		state: "kho/taophieunhapkho",
		path: "kho/taophieunhapkho",
	},
	{
		index: true,
		element: (
			<Provider />
		),
		state: "provider",
		path: "provider",
	},
	{
		index: true,
		element: (
			<Customer />
		),
		state: "customer",
		path: "customer",
	},
	{
		index: true,
		element: (
			<CustomerGroup />
		),
		state: "customer/group",
		path: "customer/group",
	},
];

export default routes;
