import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import AddTransactionForm from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";


// This is a Next.js feature - searchParams is automatically provided
// searchParams will contain any query parameters from the URL
export default async function AddTransactionPage({ searchParams }) {
  const accounts = await getUserAccounts();
  const editId = searchParams?.edit;    //URL /transaction/create?edit=123 then searchParams = { edit: "123" }

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);    // Fetch transaction details from server action
    initialData = transaction;
  }
  return (
    <div className="max-w-3xl mx-auto px-5">
      <div className="flex justify-center md:justify-normal mb-8">
        <h1 className="text-5xl gradient-title">
          {editId ? "Edit Transaction" : "Add Transaction"}
        </h1>
      </div>
      <AddTransactionForm 
        accounts={accounts} 
        categories={defaultCategories}
        editMode={!!editId}     // Pass boolean for edit mode
        editId={editId}         // Pass the actual editId
        initialData={initialData}
      />
    </div>
  );
}
