
        // Application State
        let tripData = {
            destination: 'Kyoto, Japan',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 3*24*60*60*1000).toISOString().split('T')[0],
            budget: 'Moderate ($$)',
            style: 'Cultural',
            targetBudget: 1500,
            days: [],
            expenses: [
                { id: 1, name: 'Flight tickets', category: 'Transport', cost: 650 },
                { id: 2, name: 'Hotel booking', category: 'Lodging', cost: 420 }
            ],
            checklist: [
                { id: 1, name: 'Passport & Visa', done: true },
                { id: 2, name: 'Travel Insurance', done: false },
                { id: 3, name: 'Universal Adapter', done: false },
                { id: 4, name: 'Local Currency / Cash', done: false }
            ]
        };

        let currentActiveDayIndex = 0;

        // On Load Init
        window.onload = function() {
            // Set initial dates in inputs
            document.getElementById('destination').value = tripData.destination;
            document.getElementById('startDate').value = tripData.startDate;
            document.getElementById('endDate').value = tripData.endDate;
            
            // Seed initial sample day data if empty
            if (tripData.days.length === 0) {
                seedInitialDays();
            }

            renderAll();
        };

        // Seed Sample Days
        function seedInitialDays() {
            tripData.days = [
                {
                    dayNum: 1,
                    title: 'Arrival & Historic District Walk',
                    activities: [
                        { id: 101, time: ' Morning', desc: 'Arrive in city, check into accommodation, grab light local refreshments.', completed: false },
                        { id: 102, time: ' Afternoon', desc: 'Explore historic city center, landmarks, and traditional market alleys.', completed: false },
                        { id: 103, time: ' Evening', desc: 'Welcome dinner at popular local restaurant featuring regional specialties.', completed: false }
                    ]
                },
                {
                    dayNum: 2,
                    title: 'Cultural Highlights & Scenic Views',
                    activities: [
                        { id: 201, time: ' Morning', desc: 'Visit famous heritage sites and serene gardens before peak crowds.', completed: false },
                        { id: 202, time: ' Afternoon', desc: 'Guided cultural workshop (crafts or culinary experience).', completed: false },
                        { id: 203, time: ' Evening', desc: 'Sunset viewpoint followed by cozy casual dining.', completed: false }
                    ]
                }
            ];
        }

        // Render UI Pipeline
        function renderAll() {
            updateSummaryHeader();
            renderDaysTabs();
            renderDayContent();
            renderBudget();
            renderChecklist();
            updateMapFrame();
        }

        // Update Top Summary Display
        function updateSummaryHeader() {
            document.getElementById('displayTripTitle').innerText = `${tripData.destination} Itinerary`;
            document.getElementById('displayTripSubtitle').innerText = `${tripData.startDate} to ${tripData.endDate} • ${tripData.style} Style`;
            document.getElementById('summaryDest').innerText = tripData.destination || 'Not set';
            
            const start = new Date(tripData.startDate);
            const end = new Date(tripData.endDate);
            const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
            document.getElementById('summaryDuration').innerText = `${diffDays} Day${diffDays > 1 ? 's' : ''}`;
            
            document.getElementById('summaryStyle').innerText = tripData.style;
            document.getElementById('summaryBudget').innerText = tripData.budget;
        }

        // Render Day Navigation Buttons
        function renderDaysTabs() {
            const container = document.getElementById('dayButtonsContainer');
            container.innerHTML = '';

            tripData.days.forEach((day, index) => {
                const btn = document.createElement('button');
                btn.className = `px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${index === currentActiveDayIndex ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`;
                btn.innerText = `Day ${index + 1}`;
                btn.onclick = () => {
                    currentActiveDayIndex = index;
                    renderDaysTabs();
                    renderDayContent();
                };
                container.appendChild(btn);
            });
        }

        // Render Current Active Day Activities
        function renderDayContent() {
            const container = document.getElementById('dayContentContainer');
            container.innerHTML = '';

            if (tripData.days.length === 0) {
                container.innerHTML = `<div class="bg-white p-8 rounded-2xl text-center text-slate-400 border border-slate-200">No days added yet. Click "Add Day" or "Build Itinerary" above!</div>`;
                return;
            }

            const day = tripData.days[currentActiveDayIndex] || tripData.days[0];
            const dayCard = document.createElement('div');
            dayCard.className = 'bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4';

            let activitiesHtml = day.activities.map((act) => `
                <div class="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
                    <div class="flex items-start gap-3 flex-grow">
                        <input type="checkbox" ${act.completed ? 'checked' : ''} onchange="toggleActivityDone(${act.id})" class="mt-1 rounded text-brand-600 focus:ring-brand-500">
                        <div>
                            <span class="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-brand-100 text-brand-700 mb-1">${act.time}</span>
                            <p class="text-sm text-slate-700 font-medium ${act.completed ? 'line-through text-slate-400' : ''}">${escapeHtml(act.desc)}</p>
                        </div>
                    </div>
                    <button onclick="removeActivity(${act.id})" class="text-slate-400 hover:text-red-500 text-xs p-1">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `).join('');

            dayCard.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div class="flex items-center space-x-2">
                        <span class="w-7 h-7 rounded-lg bg-brand-600 text-white font-bold text-xs flex items-center justify-center">${currentActiveDayIndex + 1}</span>
                        <input type="text" value="${escapeHtml(day.title)}" onchange="updateDayTitle(this.value)" class="font-bold text-slate-800 text-base border border-transparent hover:border-slate-300 focus:border-brand-500 rounded px-2 py-0.5 outline-none">
                    </div>
                    <button onclick="removeDay(${currentActiveDayIndex})" class="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 self-end sm:self-auto">
                        <i class="fa-solid fa-calendar-xmark"></i> Delete Day
                    </button>
                </div>

                <div class="space-y-3">
                    ${activitiesHtml || '<p class="text-xs text-slate-400 italic py-2">No activities planned for this day yet.</p>'}
                </div>

                <!-- Add Activity Inline Form -->
                <form onsubmit="addActivity(event)" class="flex gap-2 pt-2">
                    <select id="newActTime" class="px-2 py-1.5 text-xs border border-slate-300 rounded-lg outline-none bg-white">
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                    </select>
                    <input type="text" id="newActDesc" required placeholder="Add a new custom activity..." class="flex-grow px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500">
                    <button type="submit" class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition">Add</button>
                </form>
            `;

            container.appendChild(dayCard);
        }

        // Add / Remove Activity Logic
        function addActivity(e) {
            e.preventDefault();
            const time = document.getElementById('newActTime').value;
            const desc = document.getElementById('newActDesc').value;
            if (!desc) return;

            tripData.days[currentActiveDayIndex].activities.push({
                id: Date.now(),
                time: time,
                desc: desc,
                completed: false
            });
            renderDayContent();
        }

        function removeActivity(actId) {
            const day = tripData.days[currentActiveDayIndex];
            day.activities = day.activities.filter(a => a.id !== actId);
            renderDayContent();
        }

        function toggleActivityDone(actId) {
            const day = tripData.days[currentActiveDayIndex];
            const act = day.activities.find(a => a.id === actId);
            if (act) act.completed = !act.completed;
            renderDayContent();
        }

        function updateDayTitle(newTitle) {
            tripData.days[currentActiveDayIndex].title = newTitle;
        }

        function addNewDay() {
            tripData.days.push({
                dayNum: tripData.days.length + 1,
                title: 'Exploration & Discoveries',
                activities: []
            });
            currentActiveDayIndex = tripData.days.length - 1;
            renderDaysTabs();
            renderDayContent();
        }

        function removeDay(index) {
            if (tripData.days.length <= 1) {
                alert("Itinerary must contain at least one day!");
                return;
            }
            tripData.days.splice(index, 1);
            currentActiveDayIndex = Math.max(0, index - 1);
            renderDaysTabs();
            renderDayContent();
        }

        // Handle Submit & Generate AI Itinerary
        async function handleTripSubmit(e) {
            e.preventDefault();
            tripData.destination = document.getElementById('destination').value;
            tripData.startDate = document.getElementById('startDate').value;
            tripData.endDate = document.getElementById('endDate').value;
            tripData.budget = document.getElementById('budgetCriterion').value;
            tripData.style = document.getElementById('travelStyle').value;

            updateSummaryHeader();
            updateMapFrame();

            // AI Generation Call
            const loader = document.getElementById('aiLoading');
            const container = document.getElementById('dayContentContainer');
            loader.classList.remove('hidden');
            container.classList.add('hidden');

            try {
                const systemPrompt = "Act as an expert travel guide. Generate a structured JSON itinerary response.";
                const userQuery = `Create a detailed ${tripData.style} trip itinerary for ${tripData.destination} with a budget of ${tripData.budget}. Calculate days between ${tripData.startDate} and ${tripData.endDate}. Return JSON format with array of days: [{"dayNum": 1, "title": "...", "activities": [{"time": "Morning/Afternoon/Evening", "desc": "..."}]}]`;

                const apiKey = ""; // Canvas runtime automatically supplies key if empty
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

                const payload = {
                    contents: [{ parts: [{ text: userQuery }] }],
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    generationConfig: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    dayNum: { type: "INTEGER" },
                                    title: { type: "STRING" },
                                    activities: {
                                        type: "ARRAY",
                                        items: {
                                            type: "OBJECT",
                                            properties: {
                                                time: { type: "STRING" },
                                                desc: { type: "STRING" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                };

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;

                if (jsonText) {
                    const parsedDays = JSON.parse(jsonText);
                    tripData.days = parsedDays.map(d => ({
                        dayNum: d.dayNum,
                        title: d.title || `Day ${d.dayNum}`,
                        activities: (d.activities || []).map((a, idx) => ({
                            id: Date.now() + Math.random(),
                            time: a.time || 'Morning',
                            desc: a.desc || '',
                            completed: false
                        }))
                    }));
                }
            } catch (err) {
                console.error("AI Generation failed, falling back to customized defaults:", err);
                seedInitialDays();
            } finally {
                loader.classList.add('hidden');
                container.classList.remove('hidden');
                currentActiveDayIndex = 0;
                renderDaysTabs();
                renderDayContent();
            }
        }

        // TAB CONTENT 2: BUDGETING TRACKER LOGIC
        function renderBudget() {
            const tbody = document.getElementById('expenseTableBody');
            tbody.innerHTML = '';

            let totalSpent = 0;
            tripData.expenses.forEach((item) => {
                totalSpent += item.cost;
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-slate-50 transition';
                tr.innerHTML = `
                    <td class="p-3 font-medium text-slate-800">${escapeHtml(item.name)}</td>
                    <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">${item.category}</span></td>
                    <td class="p-3 text-right font-semibold">$${item.cost.toFixed(2)}</td>
                    <td class="p-3 text-center">
                        <button onclick="removeBudgetItem(${item.id})" class="text-slate-400 hover:text-red-500">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            document.getElementById('itemCount').innerText = `${tripData.expenses.length} Items`;
            document.getElementById('budgetSummaryText').innerText = `$${totalSpent.toFixed(0)} / $${tripData.targetBudget}`;
            document.getElementById('totalAllocated').innerText = `$${tripData.targetBudget}`;
            
            const remaining = tripData.targetBudget - totalSpent;
            const remainingElem = document.getElementById('totalRemaining');
            remainingElem.innerText = `$${remaining.toFixed(0)}`;
            remainingElem.className = remaining >= 0 ? "text-base font-bold text-emerald-600" : "text-base font-bold text-red-600";

            const pct = Math.min(100, Math.round((totalSpent / tripData.targetBudget) * 100));
            document.getElementById('progressBar').style.width = `${pct}%`;
        }

        function addBudgetItem(e) {
            e.preventDefault();
            const name = document.getElementById('expenseName').value;
            const category = document.getElementById('expenseCategory').value;
            const cost = parseFloat(document.getElementById('expenseCost').value);

            if (!name || isNaN(cost)) return;

            tripData.expenses.push({ id: Date.now(), name, category, cost });
            document.getElementById('expenseName').value = '';
            document.getElementById('expenseCost').value = '';
            renderBudget();
        }

        function removeBudgetItem(id) {
            tripData.expenses = tripData.expenses.filter(i => i.id !== id);
            renderBudget();
        }

        // TAB CONTENT 3: CHECKLIST & PACKING LOGIC
        function renderChecklist() {
            const container = document.getElementById('checklistContainer');
            container.innerHTML = '';

            let doneCount = 0;
            tripData.checklist.forEach((item) => {
                if (item.done) doneCount++;
                const div = document.createElement('div');
                div.className = `p-3 rounded-xl border flex items-center justify-between gap-2 transition ${item.done ? 'bg-emerald-50/50 border-emerald-200 text-slate-500' : 'bg-white border-slate-200 text-slate-800'}`;
                div.innerHTML = `
                    <label class="flex items-center gap-2 cursor-pointer text-xs font-medium flex-grow">
                        <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleChecklistItem(${item.id})" class="rounded text-emerald-600 focus:ring-emerald-500">
                        <span class="${item.done ? 'line-through text-slate-400' : ''}">${escapeHtml(item.name)}</span>
                    </label>
                    <button onclick="removeChecklistItem(${item.id})" class="text-slate-400 hover:text-red-500 text-xs">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                `;
                container.appendChild(div);
            });

            const total = tripData.checklist.length;
            const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100);
            document.getElementById('checklistProgressText').innerText = `${pct}% (${doneCount}/${total})`;
            document.getElementById('checklistProgressBar').style.width = `${pct}%`;
        }

        function addChecklistItem(e) {
            e.preventDefault();
            const input = document.getElementById('newCheckitem');
            if (!input.value) return;

            tripData.checklist.push({ id: Date.now(), name: input.value, done: false });
            input.value = '';
            renderChecklist();
        }

        function toggleChecklistItem(id) {
            const item = tripData.checklist.find(i => i.id === id);
            if (item) item.done = !item.done;
            renderChecklist();
        }

        function removeChecklistItem(id) {
            tripData.checklist = tripData.checklist.filter(i => i.id !== id);
            renderChecklist();
        }

        // TAB CONTENT 4: MAP EXPLORER LOGIC
        function updateMapFrame() {
            const query = encodeURIComponent(tripData.destination || 'Kyoto');
            document.getElementById('googleMapIframe').src = `https://maps.google.com/maps?q=${query}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
        }

        function openExternalMap() {
            const query = encodeURIComponent(tripData.destination || 'Kyoto');
            window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
        }

        // UI Tabs Switcher
        function switchTab(tabKey) {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('border-brand-600', 'text-brand-600', 'active');
                btn.classList.add('border-transparent', 'text-slate-500');
            });
            document.querySelectorAll('.tab-view').forEach(view => view.classList.add('hidden'));

            const selectedBtn = document.getElementById(`tab-${tabKey}`);
            const selectedView = document.getElementById(`view-${tabKey}`);

            if (selectedBtn && selectedView) {
                selectedBtn.classList.add('border-brand-600', 'text-brand-600', 'active');
                selectedBtn.classList.remove('border-transparent', 'text-slate-500');
                selectedView.classList.remove('hidden');
            }
        }

        // Helpers & File Export / Import
        function toggleSetupForm() {
            const form = document.getElementById('tripForm');
            form.classList.toggle('hidden');
        }

        function escapeHtml(text) {
            return String(text)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        function exportJSON() {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tripData, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `Itinerary_${tripData.destination.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
        }

        function triggerImport() {
            document.getElementById('importFileInput').click();
        }

        function importJSON(event) {
            const fileReader = new FileReader();
            fileReader.onload = function(e) {
                try {
                    const parsed = JSON.parse(e.target.result);
                    if (parsed && parsed.destination) {
                        tripData = parsed;
                        document.getElementById('destination').value = tripData.destination || '';
                        document.getElementById('startDate').value = tripData.startDate || '';
                        document.getElementById('endDate').value = tripData.endDate || '';
                        renderAll();
                    }
                } catch (err) {
                    alert("Invalid itinerary file uploaded.");
                }
            };
            fileReader.readAsText(event.target.files[0]);
        }
