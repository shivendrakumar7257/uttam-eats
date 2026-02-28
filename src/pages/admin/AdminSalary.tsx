import { useEffect, useState } from 'react';
import { Plus, Users, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Employee {
  id: string;
  name: string;
  designation: string;
  department: string;
  base_salary: number;
  salary_credit_date: number;
  join_date: string;
  email: string | null;
  phone: string | null;
  status: string;
}

interface SalaryPayment {
  id: string;
  employee_id: string;
  month: number;
  year: number;
  base_salary: number;
  bonus: number;
  deductions: number;
  net_salary: number;
  payment_status: string;
  payment_date: string | null;
  notes: string | null;
  employees?: { name: string; designation: string };
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const AdminSalary = () => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payments, setPayments] = useState<SalaryPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'employees' | 'payments'>('employees');
  const [empOpen, setEmpOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [empForm, setEmpForm] = useState({
    name: '', designation: '', department: 'General',
    base_salary: '', salary_credit_date: '1',
    join_date: new Date().toISOString().split('T')[0],
    email: '', phone: '',
  });

  const [payForm, setPayForm] = useState({
    employee_id: '', month: String(now.getMonth() + 1),
    year: String(now.getFullYear()),
    bonus: '0', deductions: '0', notes: '',
  });

  const fetchData = async () => {
    setLoading(true);
    const [{ data: emps }, { data: pays }] = await Promise.all([
      supabase.from('employees').select('*').order('name'),
      supabase.from('salary_payments').select('*, employees(name, designation)').order('year', { ascending: false }).order('month', { ascending: false }),
    ]);
    setEmployees(emps || []);
    setPayments((pays || []) as SalaryPayment[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('employees').insert({
      name: empForm.name, designation: empForm.designation,
      department: empForm.department, base_salary: parseFloat(empForm.base_salary),
      salary_credit_date: parseInt(empForm.salary_credit_date),
      join_date: empForm.join_date,
      email: empForm.email || null, phone: empForm.phone || null,
    });
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Employee added!' }); setEmpOpen(false); fetchData(); }
  };

  const handlePaySalary = async (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === payForm.employee_id);
    if (!emp) return;

    // Check if salary already processed for this month/year
    const existing = payments.find(p =>
      p.employee_id === payForm.employee_id &&
      p.month === parseInt(payForm.month) &&
      p.year === parseInt(payForm.year)
    );
    if (existing) {
      toast({ title: 'Already processed', description: 'Salary for this month is already recorded.', variant: 'destructive' });
      return;
    }

    const { error } = await supabase.from('salary_payments').insert({
      employee_id: payForm.employee_id,
      month: parseInt(payForm.month),
      year: parseInt(payForm.year),
      base_salary: emp.base_salary,
      bonus: parseFloat(payForm.bonus),
      deductions: parseFloat(payForm.deductions),
      payment_status: 'paid',
      payment_date: new Date().toISOString().split('T')[0],
      notes: payForm.notes || null,
    });
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Salary credited!' }); setPayOpen(false); fetchData(); }
  };

  const updatePaymentStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('salary_payments').update({ payment_status: status }).eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Status updated' }); fetchData(); }
  };

  const filteredPayments = payments.filter(p => p.month === selectedMonth && p.year === selectedYear);
  const totalPayroll = filteredPayments.reduce((s, p) => s + Number(p.net_salary), 0);
  const paidCount = filteredPayments.filter(p => p.payment_status === 'paid').length;

  const selectedEmployee = employees.find(e => e.id === payForm.employee_id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Salary Management</h1>
          <p className="text-muted-foreground">Manage employees and process monthly salaries</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={empOpen} onOpenChange={setEmpOpen}>
            <DialogTrigger asChild>
              <Button variant="outline"><Users className="h-4 w-4 mr-2" />Add Employee</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Add New Employee</DialogTitle></DialogHeader>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input required value={empForm.name} onChange={e => setEmpForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Designation</Label>
                    <Input required value={empForm.designation} onChange={e => setEmpForm(f => ({ ...f, designation: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input value={empForm.department} onChange={e => setEmpForm(f => ({ ...f, department: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Base Salary (₹/month)</Label>
                    <Input required type="number" min="0" value={empForm.base_salary} onChange={e => setEmpForm(f => ({ ...f, base_salary: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Salary Credit Date (day of month)</Label>
                    <Input type="number" min="1" max="31" value={empForm.salary_credit_date} onChange={e => setEmpForm(f => ({ ...f, salary_credit_date: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Join Date</Label>
                    <Input type="date" value={empForm.join_date} onChange={e => setEmpForm(f => ({ ...f, join_date: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={empForm.email} onChange={e => setEmpForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={empForm.phone} onChange={e => setEmpForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                </div>
                <Button type="submit" className="w-full">Add Employee</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={payOpen} onOpenChange={setPayOpen}>
            <DialogTrigger asChild>
              <Button><DollarSign className="h-4 w-4 mr-2" />Process Salary</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Process Salary Payment</DialogTitle></DialogHeader>
              <form onSubmit={handlePaySalary} className="space-y-4">
                <div className="space-y-2">
                  <Label>Employee</Label>
                  <Select value={payForm.employee_id} onValueChange={v => setPayForm(f => ({ ...f, employee_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                    <SelectContent>
                      {employees.map(emp => (
                        <SelectItem key={emp.id} value={emp.id}>{emp.name} — {emp.designation}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedEmployee && (
                  <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
                    <p><span className="text-muted-foreground">Base Salary:</span> <strong>₹{Number(selectedEmployee.base_salary).toLocaleString('en-IN')}</strong></p>
                    <p><span className="text-muted-foreground">Credit Date:</span> <strong>{selectedEmployee.salary_credit_date}th of every month</strong></p>
                    <p><span className="text-muted-foreground">Department:</span> {selectedEmployee.department}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Select value={payForm.month} onValueChange={v => setPayForm(f => ({ ...f, month: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((m, i) => <SelectItem key={i} value={String(i+1)}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input type="number" value={payForm.year} onChange={e => setPayForm(f => ({ ...f, year: e.target.value }))} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bonus (₹)</Label>
                    <Input type="number" min="0" value={payForm.bonus} onChange={e => setPayForm(f => ({ ...f, bonus: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Deductions (₹)</Label>
                    <Input type="number" min="0" value={payForm.deductions} onChange={e => setPayForm(f => ({ ...f, deductions: e.target.value }))} />
                  </div>
                </div>

                {selectedEmployee && (
                  <div className="bg-primary/10 rounded-lg p-3 text-sm">
                    <p className="font-semibold">Net Salary: ₹{(
                      Number(selectedEmployee.base_salary) +
                      parseFloat(payForm.bonus || '0') -
                      parseFloat(payForm.deductions || '0')
                    ).toLocaleString('en-IN')}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Input value={payForm.notes} onChange={e => setPayForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes" />
                </div>
                <Button type="submit" className="w-full" disabled={!payForm.employee_id}>Credit Salary</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setTab('employees')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'employees' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Employees ({employees.length})
        </button>
        <button
          onClick={() => setTab('payments')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'payments' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Salary Payments
        </button>
      </div>

      {tab === 'employees' && (
        <Card>
          <CardHeader><CardTitle>All Employees</CardTitle></CardHeader>
          <CardContent>
            {loading ? <p className="text-muted-foreground">Loading...</p> : employees.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No employees added yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Designation</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Department</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Credit Date</th>
                      <th className="text-right py-3 px-2 font-medium text-muted-foreground">Base Salary</th>
                      <th className="text-center py-3 px-2 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3 px-2 font-medium">{emp.name}</td>
                        <td className="py-3 px-2 text-muted-foreground">{emp.designation}</td>
                        <td className="py-3 px-2 text-muted-foreground">{emp.department}</td>
                        <td className="py-3 px-2 text-muted-foreground">{emp.salary_credit_date}th</td>
                        <td className="py-3 px-2 text-right font-semibold">₹{Number(emp.base_salary).toLocaleString('en-IN')}</td>
                        <td className="py-3 px-2 text-center">
                          <Badge variant={emp.status === 'active' ? 'default' : 'secondary'}>{emp.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {tab === 'payments' && (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex gap-3 items-center">
            <Select value={String(selectedMonth)} onValueChange={v => setSelectedMonth(parseInt(v))}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, i) => <SelectItem key={i} value={String(i+1)}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="number" className="w-28" value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))} />
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Payroll</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold">₹{totalPayroll.toLocaleString('en-IN')}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Salaries Paid</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold">{paidCount} / {filteredPayments.length}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pending</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold">{filteredPayments.filter(p => p.payment_status === 'pending').length}</p></CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>{MONTHS[selectedMonth - 1]} {selectedYear} — Salary Payments</CardTitle></CardHeader>
            <CardContent>
              {filteredPayments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No salary records for this month.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">Employee</th>
                        <th className="text-right py-3 px-2 font-medium text-muted-foreground">Base</th>
                        <th className="text-right py-3 px-2 font-medium text-muted-foreground">Bonus</th>
                        <th className="text-right py-3 px-2 font-medium text-muted-foreground">Deductions</th>
                        <th className="text-right py-3 px-2 font-medium text-muted-foreground">Net</th>
                        <th className="text-center py-3 px-2 font-medium text-muted-foreground">Status</th>
                        <th className="text-center py-3 px-2 font-medium text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.map(pay => (
                        <tr key={pay.id} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-3 px-2 font-medium">{pay.employees?.name}<br/><span className="text-xs text-muted-foreground">{pay.employees?.designation}</span></td>
                          <td className="py-3 px-2 text-right">₹{Number(pay.base_salary).toLocaleString('en-IN')}</td>
                          <td className="py-3 px-2 text-right text-chart-2">+₹{Number(pay.bonus).toLocaleString('en-IN')}</td>
                          <td className="py-3 px-2 text-right text-destructive">-₹{Number(pay.deductions).toLocaleString('en-IN')}</td>
                          <td className="py-3 px-2 text-right font-bold">₹{Number(pay.net_salary).toLocaleString('en-IN')}</td>
                          <td className="py-3 px-2 text-center">
                            <Badge variant={pay.payment_status === 'paid' ? 'default' : pay.payment_status === 'pending' ? 'secondary' : 'destructive'}>
                              {pay.payment_status === 'paid' && <CheckCircle className="h-3 w-3 mr-1 inline" />}
                              {pay.payment_status === 'pending' && <Clock className="h-3 w-3 mr-1 inline" />}
                              {pay.payment_status}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 text-center">
                            {pay.payment_status !== 'paid' && (
                              <Button size="sm" variant="outline" onClick={() => updatePaymentStatus(pay.id, 'paid')}>Mark Paid</Button>
                            )}
                            {pay.payment_status === 'paid' && (
                              <Button size="sm" variant="ghost" onClick={() => updatePaymentStatus(pay.id, 'hold')}>Hold</Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminSalary;
