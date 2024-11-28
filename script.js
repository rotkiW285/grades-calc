document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('gradesForm');
    const addGradeButton = document.getElementById('addGrade');
    const clearGradesButton = document.getElementById('clearGrades');
    const averageDisplay = document.createElement('div');
    averageDisplay.id = 'averageDisplay';
    form.appendChild(averageDisplay);

    addGradeButton.addEventListener('click', () => {
        addGradeEntry();
        saveGradesToCache();
        calculateAndDisplayAverage();
    });

    clearGradesButton.addEventListener('click', () => {
        const gradeEntries = document.querySelectorAll('.grade-entry');
        gradeEntries.forEach(entry => entry.remove());
        localStorage.removeItem('grades');
        calculateAndDisplayAverage();
    });

    form.addEventListener('input', () => {
        saveGradesToCache();
        calculateAndDisplayAverage();
    });

    function addGradeEntry(grade = '', weight = '') {
        const gradeEntry = document.createElement('div');
        gradeEntry.className = 'grade-entry';
        gradeEntry.innerHTML = `
            <input type="number" name="grade" placeholder="Ocena" value="${grade}" required inputmode="numeric">
            <input type="number" name="weight" placeholder="Waga" value="${weight}" required inputmode="numeric">
            <button type="button" class="removeGrade">Usuń</button>
        `;
        form.insertBefore(gradeEntry, addGradeButton);

        gradeEntry.querySelector('.removeGrade').addEventListener('click', () => {
            gradeEntry.remove();
            saveGradesToCache();
            calculateAndDisplayAverage();
        });
    }

    function saveGradesToCache() {
        const grades = [];
        document.querySelectorAll('.grade-entry').forEach(entry => {
            const grade = entry.querySelector('input[name="grade"]').value;
            const weight = entry.querySelector('input[name="weight"]').value;
            if (grade && weight) {
                grades.push({ grade: parseFloat(grade), weight: parseFloat(weight) });
            }
        });
        localStorage.setItem('grades', JSON.stringify(grades));
    }

    function loadGradesFromCache() {
        const grades = JSON.parse(localStorage.getItem('grades')) || [];
        grades.forEach(({ grade, weight }) => {
            addGradeEntry(grade, weight);
        });
        calculateAndDisplayAverage();
    }

    function calculateAndDisplayAverage() {
        const grades = JSON.parse(localStorage.getItem('grades')) || [];
        if (grades.length === 0) {
            averageDisplay.textContent = '';
            return;
        }
        let totalWeight = 0;
        let weightedSum = 0;
        grades.forEach(({ grade, weight }) => {
            weightedSum += grade * weight;
            totalWeight += weight;
        });
        const weightedAverage = weightedSum / totalWeight;
        averageDisplay.textContent = `Średnia ważona: ${weightedAverage.toFixed(2)}`;
    }

    loadGradesFromCache();
});