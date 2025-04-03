
// Main application code with all new features integrated
document.addEventListener('DOMContentLoaded', function() {
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
            
            document.getElementById('energy-results').classList.remove('hidden');
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
            
            // Update 3D visualization
            updateRoomVisualization(length, width, height);
            
            document.getElementById('btu-results').classList.remove('hidden');
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
                daikin: { name: "ডাইকিন FTKM", price: 120000, iseer: 5.2 },
                midea: { name: "মিডিয়া পার্ল", price: 85000, iseer: 5.0 },
                gree: { name: "গ্রী ব্রিজ", price: 75000, iseer: 4.8 },
                lg: { name: "এলজি ডুয়াল কুল", price: 95000, iseer: 4.9 }
            };
            
            const comparisonData = selectedModels.map(model => modelData[model]);
            updatePriceChart(comparisonData);
            
            // Calculate savings
            if (comparisonData.length > 1) {
                const baseModel = comparisonData[0];
                const otherModels = comparisonData.slice(1);
                
                let savingsHtml = '';
                otherModels.forEach(model => {
                    const yearlySavings = (baseModel.iseer - model.iseer) * 1000; // Simplified calculation
                    savingsHtml += `
                        <div class="savings-comparison">
                            <h4>${baseModel.name} vs ${model.name}</h4>
                            <p>১ বছর: ৳${yearlySavings.toFixed(2)}</p>
                            <p>৩ বছর: ৳${(yearlySavings * 3).toFixed(2)}</p>
                            <p>৫ বছর: ৳${(yearlySavings * 5).toFixed(2)}</p>
                        </div>
                    `;
                });
                
                document.getElementById('savings-calculation').innerHTML = `
                    <h3 class="section-title"><i class="fas fa-coins"></i> দীর্ঘমেয়াদী সঞ্চয়</h3>
                    ${savingsHtml}
                `;
                document.getElementById('savings-calculation').classList.remove('hidden');
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
        } else {
            alert('দয়া করে মেইনটেনেন্স টাইপ এবং তারিখ পূরণ করুন');
        }
    });
    
    // Load maintenance log when tab is opened
    document.getElementById('view-schedule').addEventListener('click', function() {
        const maintenanceLog = JSON.parse(localStorage.getItem('acMaintenanceLog')) || [];
        document.getElementById('maintenance-log').innerHTML = `
            <h3 class="section-title"><i class="fas fa-history"></i> মেইনটেনেন্স লগ (${maintenanceLog.length} এন্ট্রি)</h3>
        `;
        
        if (maintenanceLog.length > 0) {
            maintenanceLog.forEach(entry => {
                addMaintenanceEntry(entry);
            });
        } else {
            document.getElementById('maintenance-log').innerHTML += `
                <p style="text-align: center; color: var(--text-muted);">কোন মেইনটেনেন্স রেকর্ড পাওয়া যায়নি</p>
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
                    { user: "করিম", rating: 4, comment: "ভাল কিন্তু দাম একটু বেশি", date: "২০২৩-১০-২৮" }
                ],
                midea: [
                    { user: "সুমন", rating: 5, comment: "দামের তুলনায় সেরা পারফরম্যান্স", date: "২০২৩-১১-০৫" },
                    { user: "জাহিদ", rating: 3, comment: "মাঝারি মানের, সার্ভিস ভাল না", date: "২০২৩-০৯-১২" }
                ],
                gree: [
                    { user: "আনিস", rating: 4, comment: "ভাল পারফরম্যান্স, সাশ্রয়ী", date: "২০২৩-১১-১০" }
                ]
            };
            
            const modelReviews = reviews[model] || [];
            const averageRating = modelReviews.length > 0 ? 
                (modelReviews.reduce((sum, review) => sum + review.rating, 0) / modelReviews.length).toFixed(1) : 0;
            
            // Update review stats
            document.getElementById('review-model-name').textContent = 
                document.getElementById('review-model').selectedOptions[0].text;
            document.getElementById('average-rating').textContent = averageRating;
            document.getElementById('review-count').textContent = modelReviews.length;
            
            // Update star rating display
            const ratingStars = document.querySelector('.rating-stars');
            ratingStars.innerHTML = '';
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('i');
                star.className = i <= averageRating ? 'fas fa-star' : 'far fa-star';
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
                            <span><strong>${review.user}</strong> - ${review.date}</span>
                            <span class="review-rating">${stars}</span>
                        </div>
                        <p>${review.comment}</p>
                    `;
                    
                    reviewList.appendChild(reviewCard);
                });
            } else {
                reviewList.innerHTML = '<p>এই মডেলের জন্য কোন রিভিউ পাওয়া যায়নি</p>';
            }
            
            document.getElementById('model-reviews').classList.remove('hidden');
        } else {
            document.getElementById('model-reviews').classList.add('hidden');
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
        } else {
            alert('দয়া করে রেটিং এবং রিভিউ লিখুন');
        }
    });
    
    // Feature 11: Report Generation
    document.getElementById('generate-pdf').addEventListener('click', function() {
        // In a real app, this would generate an actual PDF
        const reportContent = generateReportContent();
        document.getElementById('report-preview-content').innerHTML = reportContent;
        document.getElementById('report-preview').classList.remove('hidden');
        
        alert('PDF রিপোর্ট জেনারেট করা হয়েছে (ডেমো)');
    });
    
    document.getElementById('generate-excel').addEventListener('click', function() {
        alert('এক্সেল রিপোর্ট জেনারেট করা হয়েছে (ডেমো)');
    });
    
    // Initialize the app
    loadDefaultData();
});

// Helper functions for new features
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

function updateRoomVisualization(length, width, height) {
    const room3d = document.getElementById('room-3d');
    room3d.innerHTML = `
        <div style="width: 100%; height: 100%; position: relative;">
            <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
                width: ${width * 10}px; height: ${length * 10}px; background: rgba(74, 155, 255, 0.3);
                border: 2px solid var(--primary); display: flex; justify-content: center; align-items: center;
                font-size: 12px;">
                ${length} × ${width} × ${height} ফুট
            </div>
        </div>
    `;
}

function addMaintenanceEntry(entry) {
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    
    const typeMap = {
        filter: "ফিল্টার পরিষ্কার",
        gas: "গ্যাস রিফিল",
        service: "সার্ভিসিং"
    };
    
    logEntry.innerHTML = `
        <div>
            <strong>${typeMap[entry.type] || entry.type}</strong>
            <span style="color: var(--text-muted); font-size: 0.9em; margin-left: 10px;">${entry.date}</span>
        </div>
        <div>${entry.notes || 'কোন নোট নেই'}</div>
    `;
    
    document.getElementById('maintenance-log').appendChild(logEntry);
}

function generateReportContent() {
    const includeAnalysis = document.getElementById('include-analysis').checked;
    const includeEnergy = document.getElementById('include-energy').checked;
    const includeComparison = document.getElementById('include-comparison').checked;
    const includeMaintenance = document.getElementById('include-maintenance').checked;
    const reportPeriod = document.getElementById('report-period').value;
    
    let reportHTML = '<div style="padding: 20px; color: #333;">';
    reportHTML += '<h1 style="color: var(--primary); text-align: center;">এসি পারফরম্যান্স রিপোর্ট</h1>';
    reportHTML += `<p style="text-align: center;">রিপোর্ট তারিখ: ${new Date().toLocaleDateString('bn-BD')}</p>`;
    
    if (includeAnalysis) {
        reportHTML += `
            <h2 style="border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 20px;">কর্মক্ষমতা বিশ্লেষণ</h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 15px 0;">
                <div style="background: #f5f5f5; padding: 10px; border-radius: 5px;">
                    <h3 style="margin: 0 0 5px 0; color: var(--primary);">শক্তি দক্ষতা</h3>
                    <p style="margin: 0;">স্কোর: 92%</p>
                </div>
                <div style="background: #f5f5f5; padding: 10px; border-radius: 5px;">
                    <h3 style="margin: 0 0 5px 0; color: var(--primary);">তাপমাত্রা স্থিতিশীলতা</h3>
                    <p style="margin: 0;">স্কোর: 95%</p>
                </div>
                <div style="background: #f5f5f5; padding: 10px; border-radius: 5px;">
                    <h3 style="margin: 0 0 5px 0; color: var(--primary);">সর্বনিম্ন স্পিড মডুলেশন</h3>
                    <p style="margin: 0;">10%</p>
                </div>
            </div>
        `;
    }
    
    if (includeEnergy) {
        reportHTML += `
            <h2 style="border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 20px;">এনার্জি কনজাম্পশন</h2>
            <div style="margin: 15px 0;">
                <div style="background: #f5f5f5; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                    <h3 style="margin: 0 0 5px 0; color: var(--primary);">দৈনিক খরচ</h3>
                    <p style="margin: 0;">5.4 kWh (৳32.40)</p>
                </div>
                <div style="background: #f5f5f5; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                    <h3 style="margin: 0 0 5px 0; color: var(--primary);">মাসিক খরচ</h3>
                    <p style="margin: 0;">162 kWh (৳972.00)</p>
                </div>
                <div style="background: #f5f5f5; padding: 10px; border-radius: 5px;">
                    <h3 style="margin: 0 0 5px 0; color: var(--primary);">বার্ষিক খরচ</h3>
                    <p style="margin: 0;">1971 kWh (৳11,826.00)</p>
                </div>
            </div>
        `;
    }
    
    if (includeComparison) {
        reportHTML += `
            <h2 style="border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 20px;">মডেল তুলনা</h2>
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
            <h2 style="border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 20px;">মেইনটেনেন্স ইতিহাস</h2>
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
            reportHTML += '<p>কোন মেইনটেনেন্স রেকর্ড পাওয়া যায়নি</p>';
        }
    }
    
    reportHTML += '</div>';
    return reportHTML;
}

function loadDefaultData() {
    // Set default date for maintenance
    document.getElementById('maintenance-date').valueAsDate = new Date();
    
    // Load sample reviews for default model
    document.getElementById('review-model').value = 'daikin';
    document.getElementById('review-model').dispatchEvent(new Event('change'));
}
