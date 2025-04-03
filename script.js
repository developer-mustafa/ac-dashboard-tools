
// Main application code with all features integrated
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Set initial theme
    if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    themeToggle.addEventListener('click', function() {
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Dashboard/Feature Tabs Toggle
    const dashboardBtn = document.getElementById('dashboardBtn');
    const dashboardView = document.getElementById('dashboard-view');
    const featureTabs = document.getElementById('featureTabs');

    dashboardBtn.addEventListener('click', function() {
        if (dashboardView.classList.contains('active')) {
            // Switch to feature tabs
            dashboardView.classList.remove('active');
            featureTabs.style.display = 'flex';
            document.querySelector('.tab-btn[data-tab="analysis"]').click();
        } else {
            // Switch to dashboard
            dashboardView.classList.add('active');
            featureTabs.style.display = 'none';
            updateDashboard();
        }
    });

    // Quick Action Buttons
    document.getElementById('quickEnergyCalc').addEventListener('click', function() {
        dashboardView.classList.remove('active');
        featureTabs.style.display = 'flex';
        document.querySelector('.tab-btn[data-tab="energy"]').click();
    });

    document.getElementById('quickRoomCalc').addEventListener('click', function() {
        dashboardView.classList.remove('active');
        featureTabs.style.display = 'flex';
        document.querySelector('.tab-btn[data-tab="room"]').click();
    });

    document.getElementById('quickMaintenance').addEventListener('click', function() {
        dashboardView.classList.remove('active');
        featureTabs.style.display = 'flex';
        document.querySelector('.tab-btn[data-tab="maintenance"]').click();
    });

    document.getElementById('quickReport').addEventListener('click', function() {
        dashboardView.classList.remove('active');
        featureTabs.style.display = 'flex';
        document.querySelector('.tab-btn[data-tab="report"]').click();
    });

    document.getElementById('viewAllMaintenance').addEventListener('click', function() {
        dashboardView.classList.remove('active');
        featureTabs.style.display = 'flex';
        document.querySelector('.tab-btn[data-tab="maintenance"]').click();
    });

    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });

            // Show selected tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Dashboard Functions
    function updateDashboard() {
        // Update stats
        document.getElementById('dashboard-energy').textContent = '5.4 kWh';
        document.getElementById('dashboard-efficiency').textContent = '92%';
        document.getElementById('dashboard-maintenance').textContent = '15 দিন';
        document.getElementById('dashboard-cost').textContent = '৳972';

        // Update energy chart
        updateDashboardEnergyChart();

        // Load maintenance log
        loadDashboardMaintenance();
    }

    function updateDashboardEnergyChart() {
        const ctx = document.getElementById('dashboard-energy-chart').getContext('2d');

        if (window.dashboardEnergyChart) {
            window.dashboardEnergyChart.destroy();
        }

        const days = Array.from({length: 30}, (_, i) => `${i+1} তারিখ`);
        const data = Array.from({length: 30}, () => Math.floor(Math.random() * 10) + 2);

        window.dashboardEnergyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'এনার্জি ব্যবহার (kWh)',
                    data: data,
                    backgroundColor: 'rgba(74, 155, 255, 0.2)',
                    borderColor: 'rgba(74, 155, 255, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'kWh'
                        }
                    }
                }
            }
        });
    }

    function loadDashboardMaintenance() {
        const maintenanceLog = JSON.parse(localStorage.getItem('acMaintenanceLog')) || [];
        const dashboardLog = document.getElementById('dashboard-maintenance-log');
        dashboardLog.innerHTML = '';

        // Show only last 3 entries
        const recentEntries = maintenanceLog.slice(-3).reverse();

        if (recentEntries.length > 0) {
            recentEntries.forEach(entry => {
                const logEntry = document.createElement('div');
                logEntry.className = 'log-entry';

                const typeMap = {
                    filter: { text: "ফিল্টার", class: "filter" },
                    gas: { text: "গ্যাস", class: "gas" },
                    service: { text: "সার্ভিস", class: "service" }
                };

                const typeInfo = typeMap[entry.type] || { text: entry.type, class: "" };

                logEntry.innerHTML = `
                    <div>
                        <span class="log-type ${typeInfo.class}">${typeInfo.text}</span>
                        <span style="margin-left: 10px;">${entry.date}</span>
                    </div>
                    <div>${entry.notes || ''}</div>
                `;

                dashboardLog.appendChild(logEntry);
            });
        } else {
            dashboardLog.innerHTML = `
                <p style="text-align: center; color: var(--text-muted); padding: 20px;">
                    কোন মেইনটেনেন্স রেকর্ড পাওয়া যায়নি
                </p>
            `;
        }
    }

    // Feature 1: Energy Calculator
    document.getElementById('calculate-energy').addEventListener('click', function() {
        const power = parseFloat(document.getElementById('ac-power').value) || 0;
        const hours = parseFloat(document.getElementById('daily-usage').value) || 0;
        const rate = parseFloat(document.getElementById('electricity-rate').value) || 0;

        if (power && hours && rate) {
            const dailyKWh = (power * hours) / 1000;
            const dailyCost = dailyKWh * rate;
            const monthlyCost = dailyCost * 30;
            const yearlyCost = monthlyCost * 12;

            document.getElementById('daily-cost').textContent = `${dailyKWh.toFixed(2)} kWh (৳${dailyCost.toFixed(2)})`;
            document.getElementById('monthly-cost').textContent = `${(dailyKWh * 30).toFixed(2)} kWh (৳${monthlyCost.toFixed(2)})`;
            document.getElementById('yearly-cost').textContent = `${(dailyKWh * 365).toFixed(2)} kWh (৳${yearlyCost.toFixed(2)})`;

            // Show energy chart
            updateEnergyChart([dailyCost, monthlyCost, yearlyCost]);

            document.getElementById('energy-results').style.display = 'block';
        } else {
            alert('দয়া করে সকল তথ্য সঠিকভাবে পূরণ করুন');
        }
    });

    // Feature 2: Room Size Calculator
    document.getElementById('calculate-btu').addEventListener('click', function() {
        const length = parseFloat(document.getElementById('room-length').value) || 0;
        const width = parseFloat(document.getElementById('room-width').value) || 0;
        const height = parseFloat(document.getElementById('room-height').value) || 0;
        const windows = parseInt(document.getElementById('window-count').value) || 0;
        const insulation = parseFloat(document.getElementById('insulation-level').value) || 1.0;

        if (length && width && height) {
            const volume = length * width * height;
            let btu = volume * 20; // Base calculation
            btu += windows * 1000; // Window adjustment
            btu *= insulation; // Insulation factor

            // Round to nearest 1000
            btu = Math.ceil(btu / 1000) * 1000;

            // Determine recommended tonnage
            let recommendedTon;
            if (btu <= 12000) {
                recommendedTon = "১ টন";
            } else if (btu <= 18000) {
                recommendedTon = "১.৫ টন";
            } else if (btu <= 24000) {
                recommendedTon = "২ টন";
            } else {
                recommendedTon = "২+ টন";
            }

            document.getElementById('room-volume').textContent = `${volume} ঘনফুট`;
            document.getElementById('required-btu').textContent = `${btu} BTU/hr`;
            document.getElementById('recommended-ton').textContent = recommendedTon;

            // Update visualization
            document.getElementById('room-visualization').innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: 10px;">
                        <i class="fas fa-home"></i>
                    </div>
                    <p>রুমের আয়তন: ${length} × ${width} × ${height} ফুট</p>
                    <p>প্রয়োজনীয় কুলিং: ${btu} BTU/hr</p>
                </div>
            `;

            document.getElementById('btu-results').style.display = 'block';
        } else {
            alert('দয়া করে রুমের মাত্রাগুলো সঠিকভাবে পূরণ করুন');
        }
    });

    // Feature 3: Price Comparison
    document.getElementById('compare-prices').addEventListener('click', function() {
        const selectedModels = Array.from(document.getElementById('price-model-select').selectedOptions)
            .map(option => option.value);

        if (selectedModels.length > 0) {
            // In a real app, this would fetch actual prices from a database
            const modelData = {
                daikin: { name: "ডাইকিন FTKM", price: 120000, iseer: 5.2, warranty: "5 বছর" },
                midea: { name: "মিডিয়া পার্ল", price: 85000, iseer: 5.0, warranty: "3 বছর" },
                gree: { name: "গ্রী ব্রিজ", price: 75000, iseer: 4.8, warranty: "3 বছর" },
                lg: { name: "এলজি ডুয়াল কুল", price: 95000, iseer: 4.9, warranty: "5 বছর" }
            };

            const comparisonData = selectedModels.map(model => modelData[model]);
            updatePriceChart(comparisonData);

            // Calculate savings
            if (comparisonData.length > 1) {
                const baseModel = comparisonData[0];
                let savingsHtml = '';

                comparisonData.slice(1).forEach(model => {
                    const yearlySavings = (baseModel.iseer - model.iseer) * 1000; // Simplified calculation
                    savingsHtml += `
                        <div style="margin-bottom: 15px;">
                            <h4 style="margin-bottom: 5px;">${baseModel.name} vs ${model.name}</h4>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                                <div style="background: rgba(74, 155, 255, 0.1); padding: 10px; border-radius: 8px;">
                                    <p style="margin: 0; font-weight: 500;">১ বছর</p>
                                    <p style="margin: 0; color: var(--success);">৳${yearlySavings.toFixed(2)}</p>
                                </div>
                                <div style="background: rgba(74, 155, 255, 0.1); padding: 10px; border-radius: 8px;">
                                    <p style="margin: 0; font-weight: 500;">৩ বছর</p>
                                    <p style="margin: 0; color: var(--success);">৳${(yearlySavings * 3).toFixed(2)}</p>
                                </div>
                                <div style="background: rgba(74, 155, 255, 0.1); padding: 10px; border-radius: 8px;">
                                    <p style="margin: 0; font-weight: 500;">৫ বছর</p>
                                    <p style="margin: 0; color: var(--success);">৳${(yearlySavings * 5).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    `;
                });

                document.getElementById('savings-calculation').innerHTML = `
                    <h3 class="card-title"><i class="fas fa-coins"></i> দীর্ঘমেয়াদী সঞ্চয়</h3>
                    ${savingsHtml}
                `;
                document.getElementById('savings-calculation').style.display = 'block';
            }
        } else {
            alert('দয়া করে কমপক্ষে একটি মডেল নির্বাচন করুন');
        }
    });

    // Feature 5: Maintenance Tracker
    document.getElementById('add-maintenance').addEventListener('click', function() {
        const type = document.getElementById('maintenance-type').value;
        const date = document.getElementById('maintenance-date').value || new Date().toISOString().split('T')[0];
        const notes = document.getElementById('maintenance-notes').value;

        if (type && date) {
            const maintenanceEntry = {
                type,
                date,
                notes
            };

            // Save to local storage
            let maintenanceLog = JSON.parse(localStorage.getItem('acMaintenanceLog')) || [];
            maintenanceLog.push(maintenanceEntry);
            localStorage.setItem('acMaintenanceLog', JSON.stringify(maintenanceLog));

            // Add to UI
            addMaintenanceEntry(maintenanceEntry);

            // Clear form
            document.getElementById('maintenance-notes').value = '';

            // Update dashboard if visible
            if (document.getElementById('dashboard-view').classList.contains('active')) {
                loadDashboardMaintenance();
            }
        } else {
            alert('দয়া করে মেইনটেনেন্স টাইপ এবং তারিখ পূরণ করুন');
        }
    });

    // Load maintenance log when tab is opened
    document.getElementById('view-schedule').addEventListener('click', function() {
        const maintenanceLog = JSON.parse(localStorage.getItem('acMaintenanceLog')) || [];
        const logContainer = document.getElementById('maintenance-log');
        logContainer.innerHTML = `
            <h3 class="card-title"><i class="fas fa-history"></i> মেইনটেনেন্স লগ (${maintenanceLog.length} এন্ট্রি)</h3>
        `;

        if (maintenanceLog.length > 0) {
            maintenanceLog.reverse().forEach(entry => {
                addMaintenanceEntry(entry);
            });
        } else {
            logContainer.innerHTML += `
                <p style="text-align: center; color: var(--text-muted); padding: 20px;">
                    কোন মেইনটেনেন্স রেকর্ড পাওয়া যায়নি
                </p>
            `;
        }
    });

    // Feature 8: User Reviews
    document.getElementById('review-model').addEventListener('change', function() {
        const model = this.value;
        if (model) {
            // In a real app, this would fetch reviews from a database
            const reviews = {
                daikin: [
                    { user: "রহিম", rating: 5, comment: "অসাধারণ পারফরম্যান্স, শব্দ খুব কম", date: "২০২৩-১১-১৫" },
                    { user: "করিম", rating: 4, comment: "ভাল কিন্তু দাম একটু বেশি", date: "২০২৩-১০-২৮" },
                    { user: "আরিফ", rating: 5, comment: "এনার্জি সেভিং মোড খুব ভাল কাজ করে", date: "২০২৩-০৯-১০" }
                ],
                midea: [
                    { user: "সুমন", rating: 5, comment: "দামের তুলনায় সেরা পারফরম্যান্স", date: "২০২৩-১১-০৫" },
                    { user: "জাহিদ", rating: 3, comment: "মাঝারি মানের, সার্ভিস ভাল না", date: "২০২৩-০৯-১২" }
                ],
                gree: [
                    { user: "আনিস", rating: 4, comment: "ভাল পারফরম্যান্স, সাশ্রয়ী", date: "২০২৩-১১-১০" },
                    { user: "রনি", rating: 2, comment: "কম্প্রেসার সমস্যা হয়েছে ১ বছরে", date: "২০২৩-০৮-২২" }
                ]
            };

            const modelReviews = reviews[model] || [];
            const averageRating = modelReviews.length > 0 ?
            (modelReviews.reduce((sum, review) => sum + review.rating, 0) / modelReviews.length) : 0;

            // Update review stats
            document.getElementById('review-model-name').textContent =
                document.getElementById('review-model').selectedOptions[0].text;
            document.getElementById('average-rating').textContent = averageRating.toFixed(1);
            document.getElementById('review-count').textContent = modelReviews.length;

            // Update star rating display
            const ratingStars = document.getElementById('average-rating-stars');
            ratingStars.innerHTML = '';
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('i');
                star.className = i <= averageRating ? 'fas fa-star' :
                                 (i - averageRating < 1 ? 'fas fa-star-half-alt' : 'far fa-star');
                ratingStars.appendChild(star);
            }

            // Display reviews
            const reviewList = document.getElementById('review-list');
            reviewList.innerHTML = '';

            if (modelReviews.length > 0) {
                modelReviews.forEach(review => {
                    const reviewCard = document.createElement('div');
                    reviewCard.className = 'review-card';

                    let stars = '';
                    for (let i = 1; i <= 5; i++) {
                        stars += `<i class="${i <= review.rating ? 'fas' : 'far'} fa-star"></i>`;
                    }

                    reviewCard.innerHTML = `
                        <div class="review-header">
                            <div>
                                <span class="review-user">${review.user}</span>
                                <span class="review-date">${review.date}</span>
                            </div>
                            <div class="review-rating">${stars}</div>
                        </div>
                        <p>${review.comment}</p>
                    `;

                    reviewList.appendChild(reviewCard);
                });
            } else {
                reviewList.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 20px;">এই মডেলের জন্য কোন রিভিউ পাওয়া যায়নি</p>';
            }

            document.getElementById('model-reviews').style.display = 'block';
        } else {
            document.getElementById('model-reviews').style.display = 'none';
        }
    });

    // Star rating for user review
    document.querySelectorAll('.star-rating i').forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            const stars = document.querySelectorAll('.star-rating i');

            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
        });
    });

    // Submit review
    document.getElementById('submit-review').addEventListener('click', function() {
        const model = document.getElementById('review-model').value;
        const rating = document.querySelectorAll('.star-rating .fas').length;
        const reviewText = document.getElementById('user-review').value;

        if (model && rating > 0 && reviewText) {
            // In a real app, this would save to a database
            alert('আপনার রিভিউ সাবমিট করা হয়েছে! ধন্যবাদ।');
            document.getElementById('user-review').value = '';

            // Reset stars
            document.querySelectorAll('.star-rating i').forEach(star => {
                star.classList.remove('fas');
                star.classList.add('far');
            });

            // Reload reviews
            document.getElementById('review-model').dispatchEvent(new Event('change'));
        } else {
            alert('দয়া করে রেটিং এবং রিভিউ লিখুন');
        }
    });

    // Feature 11: Report Generation
    document.getElementById('generate-pdf').addEventListener('click', function() {
        const reportContent = generateReportContent();
        document.getElementById('report-preview-content').innerHTML = reportContent;
        document.getElementById('report-preview').style.display = 'block';

        // Generate actual PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.setTextColor(74, 155, 255);
        doc.text('এসি পারফরম্যান্স রিপোর্ট', 105, 15, { align: 'center' });

        // Add date
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`রিপোর্ট তারিখ: ${new Date().toLocaleDateString('bn-BD')}`, 105, 22, { align: 'center' });

        // Add content (simplified for demo)
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        const includeAnalysis = document.getElementById('include-analysis').checked;
        const includeEnergy = document.getElementById('include-energy').checked;
        const includeComparison = document.getElementById('include-comparison').checked;
        const includeMaintenance = document.getElementById('include-maintenance').checked;

        let yPosition = 30;

        if (includeAnalysis) {
            doc.setFontSize(14);
            doc.text('কর্মক্ষমতা বিশ্লেষণ', 14, yPosition);
            yPosition += 10;

            doc.setFontSize(12);
            doc.text('শক্তি দক্ষতা: 92%', 20, yPosition);
            yPosition += 7;
            doc.text('তাপমাত্রা স্থিতিশীলতা: 95%', 20, yPosition);
            yPosition += 7;
            doc.text('সর্বনিম্ন স্পিড মডুলেশন: 10%', 20, yPosition);
            yPosition += 15;
        }

        if (includeEnergy) {
            doc.setFontSize(14);
            doc.text('এনার্জি কনজাম্পশন', 14, yPosition);
            yPosition += 10;

            doc.setFontSize(12);
            doc.text('দৈনিক খরচ: 5.4 kWh (৳32.40)', 20, yPosition);
            yPosition += 7;
            doc.text('মাসিক খরচ: 162 kWh (৳972.00)', 20, yPosition);
            yPosition += 7;
            doc.text('বার্ষিক খরচ: 1971 kWh (৳11,826.00)', 20, yPosition);
            yPosition += 15;
        }

        if (includeComparison) {
            doc.setFontSize(14);
            doc.text('মডেল তুলনা', 14, yPosition);
            yPosition += 10;

            doc.setFontSize(12);
            doc.text('ডাইকিন FTKM: ৳120,000 (ISEER 5.2)', 20, yPosition);
            yPosition += 7;
            doc.text('মিডিয়া পার্ল: ৳85,000 (ISEER 5.0)', 20, yPosition);
            yPosition += 7;
            doc.text('৫ বছরে সঞ্চয়: ৳45,000', 20, yPosition);
            yPosition += 15;
        }

        if (includeMaintenance) {
            doc.setFontSize(14);
            doc.text('মেইনটেনেন্স ইতিহাস', 14, yPosition);
            yPosition += 10;

            const maintenanceLog = JSON.parse(localStorage.getItem('acMaintenanceLog')) || [];
            if (maintenanceLog.length > 0) {
                maintenanceLog.forEach(entry => {
                    const typeMap = {
                        filter: "ফিল্টার পরিষ্কার",
                        gas: "গ্যাস রিফিল",
                        service: "সার্ভিসিং"
                    };

                    doc.setFontSize(12);
                    doc.text(`${typeMap[entry.type] || entry.type} - ${entry.date}`, 20, yPosition);
                    yPosition += 7;

                    if (yPosition > 280) {
                        doc.addPage();
                        yPosition = 20;
                    }
                });
            } else {
                doc.text('কোন মেইনটেনেন্স রেকর্ড পাওয়া যায়নি', 20, yPosition);
                yPosition += 7;
            }
        }

        // Save the PDF
        doc.save('AC_Report.pdf');
    });

    document.getElementById('generate-excel').addEventListener('click', function() {
        // Create a workbook
        const wb = XLSX.utils.book_new();

        // Create worksheets for different sections
        const includeAnalysis = document.getElementById('include-analysis').checked;
        const includeEnergy = document.getElementById('include-energy').checked;
        const includeComparison = document.getElementById('include-comparison').checked;
        const includeMaintenance = document.getElementById('include-maintenance').checked;

        if (includeAnalysis) {
            const analysisData = [
                ["কর্মক্ষমতা বিশ্লেষণ"],
                ["শক্তি দক্ষতা", "92%"],
                ["তাপমাত্রা স্থিতিশীলতা", "95%"],
                ["সর্বনিম্ন স্পিড মডুলেশন", "10%"]
            ];
            XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(analysisData), "বিশ্লেষণ");
        }

        if (includeEnergy) {
            const energyData = [
                ["এনার্জি কনজাম্পশন"],
                ["দৈনিক খরচ", "5.4 kWh", "৳32.40"],
                ["মাসিক খরচ", "162 kWh", "৳972.00"],
                ["বার্ষিক খরচ", "1971 kWh", "৳11,826.00"]
            ];
            XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(energyData), "এনার্জি");
        }

        if (includeComparison) {
            const comparisonData = [
                ["মডেল তুলনা"],
                ["মডেল", "দাম", "ISEER", "ওয়ারেন্টি"],
                ["ডাইকিন FTKM", "৳120,000", "5.2", "5 বছর"],
                ["মিডিয়া পার্ল", "৳85,000", "5.0", "3 বছর"],
                ["গ্রী ব্রিজ", "৳75,000", "4.8", "3 বছর"]
            ];
            XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(comparisonData), "তুলনা");
        }

        if (includeMaintenance) {
            const maintenanceLog = JSON.parse(localStorage.getItem('acMaintenanceLog')) || [];
            const maintenanceData = [
                ["মেইনটেনেন্স ইতিহাস"],
                ["ধরণ", "তারিখ", "নোট"]
            ];

            maintenanceLog.forEach(entry => {
                const typeMap = {
                    filter: "ফিল্টার পরিষ্কার",
                    gas: "গ্যাস রিফিল",
                    service: "সার্ভিসিং"
                };

                maintenanceData.push([
                    typeMap[entry.type] || entry.type,
                    entry.date,
                    entry.notes || '-'
                ]);
            });

            if (maintenanceData.length === 2) {
                maintenanceData.push(["কোন মেইনটেনেন্স রেকর্ড পাওয়া যায়নি"]);
            }

            XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(maintenanceData), "মেইনটেনেন্স");
        }

        // Save the Excel file
        XLSX.writeFile(wb, 'AC_Report.xlsx');
    });

    // Helper functions
    function updateEnergyChart(data) {
        const ctx = document.getElementById('energy-chart').getContext('2d');

        if (window.energyChart) {
            window.energyChart.destroy();
        }

        window.energyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['দৈনিক', 'মাসিক', 'বার্ষিক'],
                datasets: [{
                    label: 'বিদ্যুৎ খরচ (৳)',
                    data: data,
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'খরচ (৳)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'এনার্জি কনজাম্পশন বিশ্লেষণ'
                    }
                }
            }
        });
    }

    function updatePriceChart(modelData) {
        const ctx = document.getElementById('price-chart').getContext('2d');

        if (window.priceChart) {
            window.priceChart.destroy();
        }

        window.priceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: modelData.map(model => model.name),
                datasets: [
                    {
                        label: 'দাম (৳)',
                        data: modelData.map(model => model.price),
                        backgroundColor: 'rgba(255, 99, 132, 0.7)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'ISEER রেটিং',
                        data: modelData.map(model => model.iseer),
                        backgroundColor: 'rgba(54, 162, 235, 0.7)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        type: 'line',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'দাম (৳)'
                        }
                    },
                    y1: {
                        position: 'right',
                        beginAtZero: false,
                        min: 4,
                        max: 5.5,
                        title: {
                            display: true,
                            text: 'ISEER রেটিং'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'মডেল তুলনা'
                    }
                }
            }
        });
    }

    function addMaintenanceEntry(entry) {
        const logContainer = document.getElementById('maintenance-log');
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';

        const typeMap = {
            filter: { text: "ফিল্টার", class: "filter" },
            gas: { text: "গ্যাস", class: "gas" },
            service: { text: "সার্ভিস", class: "service" }
        };

        const typeInfo = typeMap[entry.type] || { text: entry.type, class: "" };

        logEntry.innerHTML = `
            <div>
                <span class="log-type ${typeInfo.class}">${typeInfo.text}</span>
                <span style="margin-left: 10px;">${entry.date}</span>
            </div>
            <div>${entry.notes || ''}</div>
        `;

        // Add to the top of the log
        if (logContainer.children.length > 1) {
            logContainer.insertBefore(logEntry, logContainer.children[1]);
        } else {
            logContainer.appendChild(logEntry);
        }
    }

    function generateReportContent() {
        const includeAnalysis = document.getElementById('include-analysis').checked;
        const includeEnergy = document.getElementById('include-energy').checked;
        const includeComparison = document.getElementById('include-comparison').checked;
        const includeMaintenance = document.getElementById('include-maintenance').checked;
        const reportPeriod = document.getElementById('report-period').value;

        let reportHTML = '<div style="padding: 20px; color: #333; max-width: 800px; margin: 0 auto;">';
        reportHTML += '<h1 style="color: #4a9bff; text-align: center; margin-bottom: 5px;">এসি পারফরম্যান্স রিপোর্ট</h1>';
        reportHTML += `<p style="text-align: center; color: #666; margin-bottom: 20px;">রিপোর্ট তারিখ: ${new Date().toLocaleDateString('bn-BD')}</p>`;

        if (includeAnalysis) {
            reportHTML += `
                <h2 style="border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 20px; color: #4a9bff;">কর্মক্ষমতা বিশ্লেষণ</h2>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 15px 0;">
                    <div style="background: #f5f5f5; padding: 10px; border-radius: 5px;">
                        <h3 style="margin: 0 0 5px 0; color: #4a9bff;">শক্তি দক্ষতা</h3>
                        <p style="margin: 0;">92%</p>
                    </div>
                    <div style="background: #f5f5f5; padding: 10px; border-radius: 5px;">
                        <h3 style="margin: 0 0 5px 0; color: #4a9bff;">তাপমাত্রা স্থিতিশীলতা</h3>
                        <p style="margin: 0;">95%</p>
                    </div>
                    <div style="background: #f5f5f5; padding: 10px; border-radius: 5px;">
                        <h3 style="margin: 0 0 5px 0; color: #4a9bff;">সর্বনিম্ন স্পিড মডুলেশন</h3>
                        <p style="margin: 0;">10%</p>
                    </div>
                </div>
            `;
        }

        if (includeEnergy) {
            reportHTML += `
                <h2 style="border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 20px; color: #4a9bff;">এনার্জি কনজাম্পশন</h2>
                <div style="margin: 15px 0;">
                    <div style="background: #f5f5f5; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                        <h3 style="margin: 0 0 5px 0; color: #4a9bff;">দৈনিক খরচ</h3>
                        <p style="margin: 0;">5.4 kWh (৳32.40)</p>
                    </div>
                    <div style="background: #f5f5f5; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                        <h3 style="margin: 0 0 5px 0; color: #4a9bff;">মাসিক খরচ</h3>
                        <p style="margin: 0;">162 kWh (৳972.00)</p>
                    </div>
                    <div style="background: #f5f5f5; padding: 10px; border-radius: 5px;">
                        <h3 style="margin: 0 0 5px 0; color: #4a9bff;">বার্ষিক খরচ</h3>
                        <p style="margin: 0;">1971 kWh (৳11,826.00)</p>
                    </div>
                </div>
            `;
        }

        if (includeComparison) {
            reportHTML += `
                <h2 style="border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 20px; color: #4a9bff;">মডেল তুলনা</h2>
                <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                    <thead>
                        <tr style="background-color: #f5f5f5;">
                            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">মডেল</th>
                            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">দাম (৳)</th>
                            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">ISEER</th>
                            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">৫ বছরে সঞ্চয়</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">ডাইকিন FTKM</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">120,000</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">5.2</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">৳45,000</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">মিডিয়া পার্ল</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">85,000</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">5.0</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">৳38,000</td>
                        </tr>
                    </tbody>
                </table>
            `;
        }

        if (includeMaintenance) {
            const maintenanceLog = JSON.parse(localStorage.getItem('acMaintenanceLog')) || [];

            reportHTML += `
                <h2 style="border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 20px; color: #4a9bff;">মেইনটেনেন্স ইতিহাস</h2>
                <p style="margin: 5px 0;">মোট এন্ট্রি: ${maintenanceLog.length}</p>
            `;

            if (maintenanceLog.length > 0) {
                reportHTML += '<table style="width: 100%; border-collapse: collapse; margin: 15px 0;">';
                reportHTML += `
                    <thead>
                        <tr style="background-color: #f5f5f5;">
                            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">ধরণ</th>
                            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">তারিখ</th>
                            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">নোট</th>
                        </tr>
                    </thead>
                    <tbody>
                `;

                maintenanceLog.forEach(entry => {
                    const typeMap = {
                        filter: "ফিল্টার পরিষ্কার",
                        gas: "গ্যাস রিফিল",
                        service: "সার্ভিসিং"
                    };

                    reportHTML += `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${typeMap[entry.type] || entry.type}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${entry.date}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${entry.notes || '-'}</td>
                        </tr>
                    `;
                });

                reportHTML += '</tbody></table>';
            } else {
                reportHTML += '<p style="text-align: center; color: #666; padding: 20px;">কোন মেইনটেনেন্স রেকর্ড পাওয়া যায়নি</p>';
            }
        }

        reportHTML += '</div>';
        return reportHTML;
    }

    // Initialize the app
    function initApp() {
        // Set default date for maintenance
        document.getElementById('maintenance-date').valueAsDate = new Date();

        // Load sample reviews for default model
        document.getElementById('review-model').value = 'daikin';
        document.getElementById('review-model').dispatchEvent(new Event('change'));

        // Load dashboard
        updateDashboard();

        // Show dashboard by default
        dashboardView.classList.add('active');
        featureTabs.style.display = 'none';
    }

    initApp();
});
