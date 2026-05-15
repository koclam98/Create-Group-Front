package com.example.meeting.service;

import com.example.meeting.domain.Participant;
import com.example.meeting.dto.ParticipantDto;
import com.example.meeting.exception.DuplicateResourceException;
import com.example.meeting.exception.ResourceNotFoundException;
import com.example.meeting.repository.ParticipantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;                                                                                                                                                  
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


/**
 * 참여자 비즈니스 로직 관리 서비스.
 * 참여자의 CRUD 작업 및 비즈니스 규칙을 처리합니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ParticipantService {

    private final ParticipantRepository participantRepository;

    /**
     * 모든 참여자를 조회합니다.
     *
     * @return 모든 참여자 응답 DTO 목록
     */
    public List<ParticipantDto.Response> findAll() {
        return participantRepository.findAll().stream()
                .map(ParticipantDto.Response::from)
                .collect(Collectors.toList());
    }

    /**
     * ID로 참여자를 조회합니다.
     *
     * @param id 참여자 ID
     * @return 참여자 응답 DTO
     * @throws ResourceNotFoundException 참여자를 찾을 수 없는 경우
     */
    public ParticipantDto.Response findById(String id) {
        Participant participant = getParticipantById(id);
        return ParticipantDto.Response.from(participant);
    }

    /**
     * 새로운 참여자를 생성합니다.
     * 전화번호가 이미 등록되지 않았는지 검증합니다.
     *
     * @param dto 참여자 생성 DTO
     * @return 생성된 참여자 응답 DTO
     * @throws DuplicateResourceException 전화번호가 이미 존재하는 경우
     */
    @Transactional
    @SuppressWarnings("null")
    public ParticipantDto.Response create(ParticipantDto.Create dto) {
        validatePhoneNotDuplicate(dto.getPhone());

        Participant participant = Participant.builder()
                .name(dto.getName())
                .position(dto.getPosition())
                .season(dto.getSeason())
                .phone(dto.getPhone())
                .build();

        Participant saved = java.util.Objects.requireNonNull(participantRepository.save(participant));
        return ParticipantDto.Response.from(saved);
    }

    /**
     * 기존 참여자를 수정합니다.
     * DTO에서 null이 아닌 필드만 수정됩니다.
     *
     * @param id 참여자 ID
     * @param dto 참여자 수정 DTO
     * @return 수정된 참여자 응답 DTO
     * @throws ResourceNotFoundException 참여자를 찾을 수 없는 경우
     */
    @Transactional
    public ParticipantDto.Response update(String id, ParticipantDto.Update dto) {
        Participant participant = getParticipantById(id);
        participant.updateInfo(dto.getName(), dto.getPosition(), dto.getSeason(), dto.getPhone());
        return ParticipantDto.Response.from(participant);
    }

    /**
     * 참여자를 삭제합니다.
     * 삭제하기 전에 모든 관련 모임에서 참여자를 제거합니다.
     *
     * @param id 참여자 ID
     * @throws ResourceNotFoundException 참여자를 찾을 수 없는 경우
     */
    @Transactional
    public void delete(String id) {
        Participant participant = getParticipantById(id);

        participantRepository.removeFromAllMeetings(id);

        participantRepository.deleteById(id);
    }

    /**
     * ID로 참여자를 조회하거나 찾을 수 없는 경우 예외를 발생시킵니다.
     *
     * @param id 참여자 ID
     * @return 참여자 엔티티
     * @throws ResourceNotFoundException 참여자를 찾을 수 없는 경우
     */
    private Participant getParticipantById(String id) {
        return participantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("참여자를 찾을 수 없습니다."));
    }

    /**
     * 전화번호가 이미 등록되지 않았는지 검증합니다.
     *
     * @param phone 검증할 전화번호
     * @throws DuplicateResourceException 전화번호가 이미 존재하는 경우
     */
    private void validatePhoneNotDuplicate(String phone) {
        if (participantRepository.existsByPhone(phone)) {
            throw new DuplicateResourceException("이미 등록된 연락처입니다.");
        }
    }

    /**
     * 파일 확장자에 따라 xlsx 또는 csv 가져오기를 실행
     * 
     * @param file 업로드된 파일 (.xlsx OR .csv)
     * @return 등록 결과
     */
    @Transactional
    public ParticipantDto.ImportResult importFromFile(MultipartFile file) {
        String filename = file.getOriginalFilename();
        if (filename != null && filename.endsWith(".csv")) {
            return importFromCsv(file);
        }
        return importFromExcel(file);
    }

    /**
     * 엑셀 파일(.xslx)에서 참여자를 일괄 등록
     * 헤더 행: 이름 | 기수 | 직함 | 연락처
     * 중복 연락처는 건너뛰고, 행별 오류를 errors 목록에 기록
     * 
     * @param file 업로드된 엑셀 파일
     * @return 등록 결과 (전체 / 성공 / 스킵 건수 + 오류 메시지)
     */
    @Transactional
    public ParticipantDto.ImportResult importFromExcel(MultipartFile file) {
        List<String> errors = new ArrayList<>();
        int totalCount = 0;
        int successCount = 0;
        int skipCount = 0;

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            // 첫 번째 시트만 읽음
            Sheet sheet = workbook.getSheetAt(0);

            // 1행부터 순회 (0행은 헤더)
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                totalCount++;

                // 셀 값 읽기: 이름(0), 기수(1) 직함(2), 연락처(3)
                String name         = getCellStringValue(row.getCell(0));
                String season       = getCellStringValue(row.getCell(1));
                String position     = getCellStringValue(row.getCell(2));
                String phone        = getCellStringValue(row.getCell(3));

                // 필수 값 누락 체크
                if (name.isBlank() || season.isBlank() || position.isBlank() || phone.isBlank()) {
                    errors.add((i + 1) + "행: 필수 값이 비어 있습니다.");
                    skipCount++;
                    continue;
                }

                // 연락처 중복 체크
                if (participantRepository.existsByPhone(phone)) {
                    errors.add((i + 1) + "행: 이미 등록된 연락처입니다. (" + phone + ")");
                    skipCount++;
                    continue;
                }

                // 참여자 저장
                Participant participant = Participant.builder()
                        .name(name)
                        .season(season)
                        .position(position)
                        .phone(phone)
                        .build();
                participantRepository.save(participant);
                successCount++;
            }
        } catch (IOException e) {
            throw new RuntimeException("엑셀 파일 읽기에 실패했습니다.", e);
        }

        return ParticipantDto.ImportResult.builder()
                .totalCount(totalCount)
                .successCount(successCount)
                .skipCount(skipCount)
                .errors(errors)
                .build();
    }

    /**
     * 셀 값을 문자열로 변환
     * 숫자 셀(연락처 등)도 문자열로 안전하게 변환
     * 
     * @param cell 엑셀 셀
     * @return 문자열 값 (null 이면 빈 문자열)
     */
    private String getCellStringValue(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING  -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            default      -> "";
        };
    }

    /**
     * CSV 파일에서 참여자를 일괄 등록
     * 헤더 행: 이름, 기수, 직함, 연락처
     * 
     * @param file 업로드된 CSV 파일
     * @return 등록 결과
     */
    @Transactional
    public ParticipantDto.ImportResult importFromCsv(MultipartFile file) {
        List<String> errors = new ArrayList<>();
        int totalCount = 0;
        int successCount = 0;
        int skipCount = 0;

        try (BufferedReader reader = new BufferedReader(
            new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8)
        )) {
            // 첫 줄(헤더) 건너뛰기
            reader.readLine();

            String line;
            int rowNum = 1;
            while ((line = reader.readLine()) != null) {
                rowNum++;
                if (line.isBlank()) continue;

                totalCount++;
                String[] columns = line.split(",", -1);

                if (columns.length < 4) {
                    errors.add(rowNum + "행: 컬럼 수가 부족합니다.");
                    skipCount++;
                    continue;
                }

                String name         = columns[0].trim();
                String season       = columns[1].trim();
                String position     = columns[2].trim();
                String phone        = columns[3].trim();

                if (name.isBlank() || season.isBlank() || position.isBlank() || phone.isBlank()) {
                    errors.add(rowNum + "행: 필수 값이 비어 있습니다.");
                    skipCount++;
                    continue;
                }

                if (participantRepository.existsByPhone(phone)) {
                    errors.add(rowNum + "행: 이미 등록된 연락처입니다. (" + phone +")");
                    skipCount++;
                    continue;
                }

                Participant participant = Participant.builder()
                        .name(name)
                        .season(season)
                        .position(position)
                        .phone(phone)
                        .build();
                participantRepository.save(participant);
                successCount++;
            }
        } catch (IOException e) {
            throw new RuntimeException("CSV 파일 읽기에 실패했습니다.", e);
        }

        return ParticipantDto.ImportResult.builder()
                .totalCount(totalCount)
                .successCount(successCount)
                .skipCount(skipCount)
                .errors(errors)
                .build();
    }
}
