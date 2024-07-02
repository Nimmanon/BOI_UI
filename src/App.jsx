import { Route, Routes } from "react-router-dom";
import PublicRoute from "./routes/PublicRoute.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import Main from "./modules/main/Main.jsx";
import Login from "./modules/login/Login.jsx";
import Missing from "./pages/pagestatus/Missing.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import MasterList from "./pages/master/MasterList.jsx";
import Level from "./pages/master/level/Level.jsx";
import LevelList from "./pages/master/level/LevelList.jsx";
import LevelForm from "./pages/master/level/LevelForm.jsx";
import LevelView from "./pages/master/level/LevelView.jsx";
import Boi from "./pages/master/boi/Boi.jsx";
import BoiList from "./pages/master/boi/BoiList.jsx";
import BoiForm from "./pages/master/boi/BoiForm.jsx";
import BoiView from "./pages/master/boi/BoiView.jsx";
import Project from "./pages/master/project/Project.jsx";
import ProjectList from "./pages/master/project/ProjectList.jsx";
import ProjectForm from "./pages/master/project/ProjectForm.jsx";
import ProjectView from "./pages/master/project/ProjectView.jsx";
// import Supplier from "./pages/master/supplier/Supplier.jsx";
// import SupplierList from "./pages/master/supplier/SupplierList.jsx";
// import SupplierForm from "./pages/master/supplier/SupplierForm.jsx";
// import SupplierView from "./pages/master/supplier/SupplierView.jsx";
import Type from "./pages/master/type/Type.jsx";
import TypeList from "./pages/master/type/TypeList.jsx";
import TypeForm from "./pages/master/type/TypeForm.jsx";
import TypeView from "./pages/master/type/TypeView.jsx";
import Owner from "./pages/master/owner/Owner.jsx";
import OwnerList from "./pages/master/owner/OwnerList.jsx";
import OwnerForm from "./pages/master/owner/OwnerForm.jsx";
import OwnerView from "./pages/master/owner/OwnerView.jsx";
import Bank from "./pages/master/bank/Bank.jsx";
import BankList from "./pages/master/bank/BankList.jsx";
import BankForm from "./pages/master/bank/BankForm.jsx";
import BankView from "./pages/master/bank/BankView.jsx";
import Objective from "./pages/master/objective/Objective.jsx";
import ObjectiveList from "./pages/master/objective/ObjectiveList.jsx";
import ObjectiveForm from "./pages/master/objective/ObjectiveForm.jsx";
import ObjectiveView from "./pages/master/objective/ObjectiveView.jsx";
import Group from "./pages/master/group/Group.jsx";
import GroupList from "./pages/master/group/GroupList.jsx";
import GroupForm from "./pages/master/group/GroupForm.jsx";
import GroupView from "./pages/master/group/GroupView.jsx";
import Coordinator from "./pages/master/coordinator/Coordinator.jsx";
import CoordinatorList from "./pages/master/coordinator/CoordinatorList.jsx";
import CoordinatorForm from "./pages/master/coordinator/CoordinatorForm.jsx";
import CoordinatorView from "./pages/master/coordinator/CoordinatorView.jsx";
import Manager from "./pages/master/manager/Manager.jsx";
import ManagerList from "./pages/master/manager/ManagerList.jsx";
import ManagerForm from "./pages/master/manager/ManagerForm.jsx";
import ManagerView from "./pages/master/manager/ManagerView.jsx";
import Deposit from "./pages/deposit/Deposit.jsx";
import DepositList from "./pages/deposit/DepositList.jsx";
import DepositForm from "./pages/deposit/DepositForm.jsx";
import DepositView from "./pages/deposit/DepositView.jsx";
import Advance from "./pages/advance/Advance.jsx";
import AdvanceList from "./pages/advance/AdvanceList.jsx";
import AdvanceForm from "./pages/advance/AdvanceForm.jsx";
import AdvanceView from "./pages/advance/AdvanceView.jsx";
import Company from "./pages/master/company/Company.jsx";
import CompanyList from "./pages/master/company/CompanyList.jsx";
import CompanyForm from "./pages/master/company/CompanyForm.jsx";
import CompanyView from "./pages/master/company/CompanyView.jsx";
import AdvanceProject from "./pages/advanceproject/AdvanceProject.jsx";
import AdvanceProjectList from "./pages/advanceproject/AdvanceProjectList.jsx";
import AdvanceProjectForm from "./pages/advanceproject/AdvanceProjectForm.jsx";
import AdvanceProjectView from "./pages/advanceproject/AdvanceProjectView.jsx";
import User from "./pages/user/User.jsx";
import UserList from "./pages/user/UserList.jsx";
import UserForm from "./pages/user/UserForm.jsx";
import UserView from "./pages/user/UserView.jsx";
import Profile from "./pages/user/profile.jsx";
import ExpenseType from "./pages/master/expensetype/ExpenseType.jsx";
import ExpenseTypeList from "./pages/master/expensetype/ExpenseTypeList.jsx";
import ExpenseTypeForm from "./pages/master/expensetype/ExpenseTypeForm.jsx";
import ExpenseTypeView from "./pages/master/expensetype/ExpenseTypeView.jsx";
import ClearAdvance from "./pages/clearadvance/ClearAdvance.jsx";
import ClearAdvanceList from "./pages/clearadvance/ClearAdvanceList.jsx";
import ClearAdvanceForm from "./pages/clearadvance/ClearAdvanceForm.jsx";
import ManageBudget from "./pages/budget/ManageBudget.jsx";
import ManageBudgetList from "./pages/budget/ManageBudgetList.jsx";
import ManageBudgetForm from "./pages/budget/ManageBudgetForm.jsx";
import ManageBudgetView from "./pages/budget/ManageBudgetView.jsx";
import ChangePassword from "./modules/login/ChangePassword.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/changepassword" element={<PublicRoute />}>
          <Route path="/changepassword" element={<ChangePassword />} />          
        </Route>
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Main />}>
            <Route path="" element={<Dashboard />} />
            <Route path="master" element={<MasterList />} />
            {/* <Route path="group" element={<Group />} /> */}

            <Route path="boi" element={<Boi />}>
              <Route index element={<BoiList />} />
              <Route path="new" element={<BoiForm />} />
              <Route path="view/:id" element={<BoiView />} />
            </Route>

            <Route path="level" element={<Level />}>
              <Route index element={<LevelList />} />
              <Route path="new" element={<LevelForm />} />
              <Route path="view/:id" element={<LevelView />} />
            </Route>

            <Route path="project" element={<Project />}>
              <Route index element={<ProjectList />} />
              <Route path="new" element={<ProjectForm />} />
              <Route path="view/:id" element={<ProjectView />} />
            </Route>

            <Route path="objective" element={<Objective />}>
              <Route index element={<ObjectiveList />} />
              <Route path="new" element={<ObjectiveForm />} />
              <Route path="view/:id" element={<ObjectiveView />} />
            </Route>

            {/* <Route path="supplier" element={<Supplier />}>
              <Route index element={<SupplierList />} />
              <Route path="new" element={<SupplierForm />} />
              <Route path="view/:id" element={<SupplierView />} />
            </Route> */}

            <Route path="type" element={<Type />}>
              <Route index element={<TypeList />} />
              <Route path="new" element={<TypeForm />} />
              <Route path="view/:id" element={<TypeView />} />
            </Route>

            <Route path="owner" element={<Owner />}>
              <Route index element={<OwnerList />} />
              <Route path="new" element={<OwnerForm />} />
              <Route path="view/:id" element={<OwnerView />} />
            </Route>

            <Route path="bank" element={<Bank />}>
              <Route index element={<BankList />} />
              <Route path="new" element={<BankForm />} />
              <Route path="view/:id" element={<BankView />} />
            </Route>

            <Route path="group" element={<Group />}>
              <Route index element={<GroupList />} />
              <Route path="new" element={<GroupForm />} />
              <Route path="view/:id" element={<GroupView />} />
            </Route>

            <Route path="coordinator" element={<Coordinator />}>
              <Route index element={<CoordinatorList />} />
              <Route path="new" element={<CoordinatorForm />} />
              <Route path="view/:id" element={<CoordinatorView />} />
            </Route>

            <Route path="manager" element={<Manager />}>
              <Route index element={<ManagerList />} />
              <Route path="new" element={<ManagerForm />} />
              <Route path="view/:id" element={<ManagerView />} />
            </Route>

            <Route path="company" element={<Company />}>
              <Route index element={<CompanyList />} />
              <Route path="new" element={<CompanyForm />} />
              <Route path="view/:id" element={<CompanyView />} />
            </Route>

            <Route path="expensetype" element={<ExpenseType />}>
              <Route index element={<ExpenseTypeList />} />
              <Route path="new" element={<ExpenseTypeForm />} />
              <Route path="view/:id" element={<ExpenseTypeView />} />
            </Route>

            <Route path="deposit" element={<Deposit />}>
              <Route index element={<DepositList />} />
              <Route path="new" element={<DepositForm />} />
              <Route path="view/:id" element={<DepositView />} />
            </Route>

            <Route path="managebudget" element={<ManageBudget />}>
              <Route index element={<ManageBudgetList />} />
              <Route path="new" element={<ManageBudgetForm />} />
              <Route path="view/:boiid/:objid" element={<ManageBudgetView />} />
            </Route>

            <Route path="advance" element={<Advance />}>
              <Route index element={<AdvanceList />} />
              <Route path="new" element={<AdvanceForm />} />
              <Route path="view/:id" element={<AdvanceView />} />
            </Route>

            <Route path="advanceproject" element={<AdvanceProject />}>
              <Route index element={<AdvanceProjectList />} />
              <Route path="new" element={<AdvanceProjectForm />} />
              <Route path="view/:id" element={<AdvanceProjectView />} />
            </Route>

            <Route path="clearadvance" element={<ClearAdvance />}>
              <Route index element={<ClearAdvanceList />} />                          
              <Route path="view/:id/:pid" element={<ClearAdvanceForm />} />
            </Route>

            {/* <Route path="stocksummary" element={<StockSummary />} />
            <Route path="stockdetail" element={<StockDetail />} />
            <Route path="inventorydetail" element={<InventoryDetail />} /> */}

            <Route path="user" element={<User />}>
              <Route index element={<UserList />} />
              <Route path="new" element={<UserForm />} />
              <Route path="view/:id" element={<UserView />} />
            </Route>

            <Route path="profile" element={<Profile />} />

            <Route path="*" element={<Missing to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
