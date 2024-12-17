import Customer from "./pages/Customer";
import CustomerGroup from "./pages/CustomerGroup";
import InvoiceExport from "./pages/InvExport";
import InvExportCreate from "./pages/InvExportCreate";
import InvoiceImport from "./pages/InvImport";
import InvoiceImportCreate from "./pages/InvImportCreate";
import InvoiceSummary from "./pages/InvSummary";
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
			<InvoiceExport />
		),
		state: "kho/xuatkho",
		path: "kho/xuatkho",
	},
	{
		index: true,
		element: (
			<InvExportCreate />
		),
		state: "kho/taophieuxuatkho",
		path: "kho/taophieuxuatkho",
	},
	{
		index: true,
		element: (
			<InvoiceSummary />
		),
		state: "kho/kiemkho",
		path: "kho/kiemkho",
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
