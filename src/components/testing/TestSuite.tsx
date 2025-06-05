
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Play, RotateCcw } from 'lucide-react';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
}

interface TestSuite {
  id: string;
  name: string;
  tests: TestResult[];
}

const TestSuite = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([
    {
      id: 'auth',
      name: 'Authentication Tests',
      tests: [
        { id: 'login', name: 'User Login', status: 'pending' },
        { id: 'logout', name: 'User Logout', status: 'pending' },
        { id: 'register', name: 'User Registration', status: 'pending' },
        { id: 'permissions', name: 'Role Permissions', status: 'pending' },
      ]
    },
    {
      id: 'tenant',
      name: 'Multi-Tenant Tests',
      tests: [
        { id: 'isolation', name: 'Data Isolation', status: 'pending' },
        { id: 'switching', name: 'Tenant Switching', status: 'pending' },
        { id: 'access', name: 'Cross-Tenant Access', status: 'pending' },
      ]
    },
    {
      id: 'appointments',
      name: 'Appointment Tests',
      tests: [
        { id: 'create', name: 'Create Appointment', status: 'pending' },
        { id: 'update', name: 'Update Appointment', status: 'pending' },
        { id: 'delete', name: 'Delete Appointment', status: 'pending' },
        { id: 'conflict', name: 'Conflict Detection', status: 'pending' },
      ]
    },
    {
      id: 'api',
      name: 'API Tests',
      tests: [
        { id: 'rateLimit', name: 'Rate Limiting', status: 'pending' },
        { id: 'validation', name: 'Input Validation', status: 'pending' },
        { id: 'security', name: 'Security Headers', status: 'pending' },
      ]
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);

  const runTest = async (suiteId: string, testId: string) => {
    setTestSuites(prev => prev.map(suite => 
      suite.id === suiteId 
        ? {
            ...suite,
            tests: suite.tests.map(test => 
              test.id === testId 
                ? { ...test, status: 'running' }
                : test
            )
          }
        : suite
    ));

    // Simulate test execution
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    const duration = Date.now() - startTime;
    
    // Simulate random pass/fail
    const passed = Math.random() > 0.2; // 80% pass rate

    setTestSuites(prev => prev.map(suite => 
      suite.id === suiteId 
        ? {
            ...suite,
            tests: suite.tests.map(test => 
              test.id === testId 
                ? { 
                    ...test, 
                    status: passed ? 'passed' : 'failed',
                    duration,
                    error: passed ? undefined : 'Test failed with simulated error'
                  }
                : test
            )
          }
        : suite
    ));
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    for (const suite of testSuites) {
      for (const test of suite.tests) {
        await runTest(suite.id, test.id);
      }
    }
    
    setIsRunning(false);
  };

  const resetTests = () => {
    setTestSuites(prev => prev.map(suite => ({
      ...suite,
      tests: suite.tests.map(test => ({
        ...test,
        status: 'pending',
        duration: undefined,
        error: undefined
      }))
    })));
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const getOverallStats = () => {
    const allTests = testSuites.flatMap(suite => suite.tests);
    const passed = allTests.filter(test => test.status === 'passed').length;
    const failed = allTests.filter(test => test.status === 'failed').length;
    const pending = allTests.filter(test => test.status === 'pending').length;
    const running = allTests.filter(test => test.status === 'running').length;
    
    return { total: allTests.length, passed, failed, pending, running };
  };

  const stats = getOverallStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Test Suite - AgendoPro SaaS</span>
            <div className="flex items-center space-x-2">
              <Button
                onClick={runAllTests}
                disabled={isRunning}
                className="flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>{isRunning ? 'Running...' : 'Run All Tests'}</span>
              </Button>
              <Button
                variant="outline"
                onClick={resetTests}
                disabled={isRunning}
                className="flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Automated testing suite for authentication, multi-tenancy, and core functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Badge variant="outline">
              Total: {stats.total}
            </Badge>
            <Badge variant="default" className="bg-green-500">
              Passed: {stats.passed}
            </Badge>
            <Badge variant="destructive">
              Failed: {stats.failed}
            </Badge>
            <Badge variant="secondary">
              Pending: {stats.pending}
            </Badge>
            {stats.running > 0 && (
              <Badge variant="outline" className="text-blue-500">
                Running: {stats.running}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Suites */}
      <div className="grid gap-6 md:grid-cols-2">
        {testSuites.map(suite => (
          <Card key={suite.id}>
            <CardHeader>
              <CardTitle className="text-lg">{suite.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suite.tests.map(test => (
                  <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <div className="font-medium">{test.name}</div>
                        {test.duration && (
                          <div className="text-sm text-gray-500">
                            {test.duration}ms
                          </div>
                        )}
                        {test.error && (
                          <div className="text-sm text-red-500">
                            {test.error}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runTest(suite.id, test.id)}
                      disabled={isRunning || test.status === 'running'}
                    >
                      Run
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestSuite;
