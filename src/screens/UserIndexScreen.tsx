import { Button } from "@/components/ui/button";
import { UserContext } from "@/components/user/useUserContext";
import { useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { Link } from "react-router";
import { useAllDocs } from "use-pouchdb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function UserIndexScreen() {
  const userContext = useContext(UserContext);
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [stressTestProgress, setStressTestProgress] = useState(0);
  
  const { rows } = useAllDocs<{
    _id: string;
    title: string;
    completed: boolean;
    stressTest?: boolean;
    batchNumber?: number;
    recordNumber?: number;
    titleLength?: number;
    createdAt?: string;
  }>({
    include_docs: true,
  });

  // Generate titles of varying lengths for stress testing
  const generateStressTestTitles = () => {
    const shortTitles = ["Buy milk", "Call mom", "Walk dog", "Read book"];
    const mediumTitles = [
      "Complete the quarterly report for the marketing department",
      "Schedule a meeting with the development team to discuss project timeline",
      "Review and update the user documentation for the new feature release"
    ];
    const longTitles = [
      "This is a very long todo item title that contains a lot of text to test how the database performs with larger string data and to see if there are any performance implications when dealing with documents that have significantly more content than typical short todo items",
      "Another extremely long todo item description that goes on and on to simulate real-world scenarios where users might enter detailed descriptions or notes that could be quite lengthy and contain multiple sentences with various punctuation marks and special characters to test database indexing and search performance",
      "Yet another comprehensive todo item with extensive details about a complex task that requires multiple steps and careful planning including coordination with various team members and stakeholders across different departments and time zones which makes this particular todo item quite detailed and comprehensive"
    ];
    
    return [...shortTitles, ...mediumTitles, ...longTitles];
  };

  const todoMutation = useMutation({
    gcTime: Infinity,
    networkMode: "offlineFirst",
    mutationFn: async (title?: string) => {
      console.log("Adding new todo");
      const _id = new Date().toISOString();
      console.log("New todo ID:", _id);
      const todoDocument = {
        _id,
        title: title || `New Todo ${Math.floor(Math.random() * 1000)}`,
        completed: false,
      };
      if (userContext.userLocalDB) {
        await userContext.userLocalDB.put(todoDocument);
        return todoDocument;
      } else {
        throw new Error("User database is not available");
      }
    },
  });

  const stressTestMutation = useMutation({
    gcTime: Infinity,
    networkMode: "offlineFirst",
    mutationFn: async () => {
      if (!userContext.userLocalDB) {
        throw new Error("User database is not available");
      }

      setIsStressTesting(true);
      setStressTestProgress(0);
      
      const titles = generateStressTestTitles();
      const batchSize = 1000; // Process in batches of 100
      const totalBatches = 10; // 10 batches = 1000 records
      
      console.log("Starting stress test: adding 1000 records in batches");
      const startTime = performance.now();

      for (let batch = 0; batch < totalBatches; batch++) {
        const batchDocs = [];
        
        for (let i = 0; i < batchSize; i++) {
          const titleIndex = Math.floor(Math.random() * titles.length);
          const randomTitle = titles[titleIndex];
          
          batchDocs.push({
            _id: `stress-test-${Date.now()}-${batch}-${i}`,
            title: `[Batch ${batch + 1}] ${randomTitle}`,
            completed: Math.random() > 0.7, // 30% chance of being completed
            stressTest: true,
            batchNumber: batch + 1,
            recordNumber: i + 1,
            titleLength: randomTitle.length,
            createdAt: new Date().toISOString()
          });
        }

        // Use bulk insert for better performance
        await userContext.userLocalDB.bulkDocs(batchDocs);
        
        setStressTestProgress(((batch + 1) / totalBatches) * 100);
        console.log(`Completed batch ${batch + 1}/${totalBatches}`);
        
        // Small delay to allow UI updates
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000;
      
      console.log(`Stress test completed! Added 1000 records in ${duration.toFixed(2)} seconds`);
      setIsStressTesting(false);
      setStressTestProgress(0);
      
      return { recordsAdded: 1000, duration };
    },
  });

  const totalCount = rows?.length || 0;
  const stressTestCount = rows?.filter(row => row.doc?.stressTest)?.length || 0;
  const regularTodoCount = totalCount - stressTestCount;

  return (
    <div className="p-6 space-y-6">
      {/* Stats Card */}
      <Button asChild>
            <Link to="/update">App Update</Link>
          </Button>
      <Card>
        <CardHeader>
          <CardTitle>Database Statistics - 4</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{totalCount } </div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{regularTodoCount}</div>
              <div className="text-sm text-muted-foreground">Regular Todos</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stressTestCount}</div>
              <div className="text-sm text-muted-foreground">Stress Test Records</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button asChild>
          <Link to="/sync">
            Check Sync Status
          </Link>
        </Button>
        
        <Button
          onClick={() => todoMutation.mutate(undefined)}
          disabled={todoMutation.isPending}
        >
          {todoMutation.isPending ? "Adding Todo..." : "Add Single Todo"}
        </Button>

        <Button
          onClick={() => stressTestMutation.mutate()}
          disabled={stressTestMutation.isPending || isStressTesting}
          variant="destructive"
        >
          {isStressTesting 
            ? `Adding Records... ${Math.round(stressTestProgress)}%` 
            : "Stress Test"}
        </Button>
      </div>

      {/* Progress indicator */}
      {isStressTesting && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(stressTestProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${stressTestProgress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Todo List */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Todo Items</h2>
        <div className="grid gap-2">
          {(rows || [])?.map((t) => {
            if (!t || !t.key) {
              return <div key={Math.random()}>undefined document</div>;
            }
            return (
              <Card key={t.key} className={t.doc?.stressTest ? "border-orange-200 bg-orange-50" : ""}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium break-words">{t.doc?.title}</h3>
                      <div className="text-sm text-muted-foreground mt-1">
                        Status: {t.doc?.completed ? "Completed" : "Pending"}
                        {t.doc?.stressTest && (
                          <span className="ml-2 text-orange-600">
                            • Stress Test Record (Batch {t.doc.batchNumber})
                          </span>
                        )}
                      </div>
                      {t.doc?.titleLength && (
                        <div className="text-xs text-gray-500 mt-1">
                          Title length: {t.doc.titleLength} characters
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default UserIndexScreen;
