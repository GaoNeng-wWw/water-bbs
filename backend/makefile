-include .env

export

OUTPUT_DIR := ./src/infra/entity

.PHONY: generate-entities
generate-entities:
	@echo "正在从数据库生成 Entity 到 $(OUTPUT_DIR)..."
	sea-orm-cli generate entity --database-url "$(DATABASE_URL)" --output-dir "$(OUTPUT_DIR)" --with-serde both
	@echo "生成完成！"

.PHONY: clean-entities
clean-entities:
	@echo "正在清理 $(OUTPUT_DIR)..."
	@rm -rf $(OUTPUT_DIR)
	@echo "清理完成。"